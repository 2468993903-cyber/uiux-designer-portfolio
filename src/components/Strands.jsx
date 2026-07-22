import { Renderer, Program, Mesh, Color, Triangle } from 'ogl'
import { useEffect, useRef } from 'react'
import './Strands.css'

const MAX_STRANDS = 12
const MAX_COLORS = 8

const VERT = `#version 300 es
in vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}`

const FRAG = `#version 300 es
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;
out vec4 fragColor;
const float PI=3.14159265;
vec3 spectrum(float t){return 0.5+0.5*cos(2.0*PI*(t+vec3(0.00,0.33,0.67)));}
vec3 samplePalette(float t){
  t=fract(t);float scaled=t*float(uColorCount);int idx=int(floor(scaled));
  float blend=fract(scaled);int nextIdx=idx+1;if(nextIdx>=uColorCount)nextIdx=0;
  return mix(uColors[idx],uColors[nextIdx],blend);
}
vec3 strandColor(float t){if(uColorCount>0)return samplePalette(t);return spectrum(t);}
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*uResolution)/uResolution.y;
  uv/=max(uScale,0.0001);
  float e=0.06+uIntensity*0.94;
  float env=pow(max(cos(uv.x*PI*1.3),0.0),uTaper);
  vec3 col=vec3(0.0);
  for(int i=0;i<${MAX_STRANDS};i++){
    if(i>=uStrandCount)break;
    float fi=float(i);float ph=fi*1.7*uSpread;float freq=(2.0+fi*0.35)*uWaviness;
    float spd=1.4+fi*1.2;float tt=uTime*uSpeed;
    float w=sin(uv.x*freq+tt*spd+ph)*0.60+sin(uv.x*freq*1.1-tt*spd*0.7+ph*1.7)*0.40;
    float amp=(0.1+0.02*e)*env*uAmplitude;float y=w*amp;float d=abs(uv.y-y);
    float thick=(0.001+0.05*e)*(0.35+env)*uThickness;float g=thick/(d+thick*0.45);g=g*g;
    float h=fi/float(uStrandCount)+uv.x*0.30+uTime*0.04+uHueShift;
    col+=strandColor(h)*g*env;
  }
  col*=0.45+0.7*e;col=1.0-exp(-col*uGlow);
  float gray=dot(col,vec3(0.2126,0.7152,0.0722));col=max(mix(vec3(gray),col,uSaturation),0.0);
  float lum=max(max(col.r,col.g),col.b);float alpha=clamp(lum,0.0,1.0)*uOpacity;
  fragColor=vec4(col*uOpacity,alpha);
}`

const buildPalette = colors => {
  const filled = colors?.length ? colors : ['#ffffff']
  return Array.from({ length: MAX_COLORS }, (_, index) => {
    const color = new Color(filled[index] ?? filled[filled.length - 1])
    return [color.r, color.g, color.b]
  })
}

export default function Strands({
  colors = ['#ff5a2a', '#b62810', '#ffb38c'], count = 3, speed = 0.3,
  amplitude = 0.7, waviness = 0.8, thickness = 0.45, glow = 2.2,
  taper = 3.5, spread = 0.8, hueShift = 0, intensity = 0.4,
  saturation = 1.1, opacity = 0.55, scale = 1.35, className = '', style,
}) {
  const propsRef = useRef({})
  propsRef.current = { colors, count, speed, amplitude, waviness, thickness, glow, taper, spread, hueShift, intensity, saturation, opacity, scale }
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    const geometry = new Triangle(gl)
    if (geometry.attributes.uv) delete geometry.attributes.uv
    const current = propsRef.current
    const program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms: {
      uTime:{value:0},uResolution:{value:[container.offsetWidth,container.offsetHeight]},
      uColors:{value:buildPalette(current.colors)},uColorCount:{value:Math.min(current.colors.length,MAX_COLORS)},
      uStrandCount:{value:Math.min(current.count,MAX_STRANDS)},uSpeed:{value:current.speed},
      uAmplitude:{value:current.amplitude},uWaviness:{value:current.waviness},uThickness:{value:current.thickness},
      uGlow:{value:current.glow},uTaper:{value:current.taper},uSpread:{value:current.spread},
      uHueShift:{value:current.hueShift},uIntensity:{value:current.intensity},uOpacity:{value:current.opacity},
      uScale:{value:current.scale},uSaturation:{value:current.saturation},
    }})
    const mesh = new Mesh(gl, { geometry, program })
    container.appendChild(gl.canvas)
    const resize = () => {
      const width = container.offsetWidth
      const height = container.offsetHeight
      renderer.setSize(width, height)
      program.uniforms.uResolution.value = [width, height]
    }
    window.addEventListener('resize', resize)
    resize()
    let frame = 0
    const update = time => {
      frame = requestAnimationFrame(update)
      const next = propsRef.current
      program.uniforms.uTime.value = time * 0.001
      program.uniforms.uColors.value = buildPalette(next.colors)
      program.uniforms.uColorCount.value = Math.min(next.colors.length, MAX_COLORS)
      program.uniforms.uStrandCount.value = Math.min(Math.max(Math.round(next.count), 1), MAX_STRANDS)
      ;['speed','amplitude','waviness','thickness','glow','taper','spread','hueShift','intensity','opacity','scale','saturation'].forEach(key => {
        program.uniforms[`u${key.charAt(0).toUpperCase()}${key.slice(1)}`].value = next[key]
      })
      renderer.render({ scene: mesh })
    }
    frame = requestAnimationFrame(update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return <div ref={containerRef} className={`strands-container ${className}`} style={style}/>
}
