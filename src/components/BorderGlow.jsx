import { useRef, useCallback, useEffect } from 'react'
import './BorderGlow.css'

function parseHSL(value){const match=value.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);return match?{h:+match[1],s:+match[2],l:+match[3]}:{h:14,s:100,l:58}}
function glowVars(value,intensity){const {h,s,l}=parseHSL(value),levels=[100,60,50,40,30,20,10],keys=['','-60','-50','-40','-30','-20','-10'],vars={};levels.forEach((opacity,index)=>{vars[`--glow-color${keys[index]}`]=`hsl(${h}deg ${s}% ${l}% / ${Math.min(opacity*intensity,100)}%)`});return vars}
const positions=['80% 55%','69% 34%','8% 6%','41% 38%','86% 85%','82% 18%','51% 4%'],map=[0,1,2,0,1,2,1]
function gradientVars(colors){const vars={};positions.forEach((position,index)=>{vars[`--gradient-${index+1}`]=`radial-gradient(at ${position},${colors[Math.min(map[index],colors.length-1)]} 0px,transparent 50%)`});vars['--gradient-base']=`linear-gradient(${colors[0]} 0 100%)`;return vars}

export default function BorderGlow({children,className='',edgeSensitivity=30,glowColor='14 100 58',backgroundColor='#0d0d0d',borderRadius=20,glowRadius=28,glowIntensity=.72,coneSpread=25,colors=['#ff5a2a','#9f210d','#ffd0ba'],fillOpacity=.22}){
  const ref=useRef(null)
  const frameRef=useRef(null),angleRef=useRef(35),lastRef=useRef(0)
  const stop=useCallback(()=>{if(frameRef.current!=null)cancelAnimationFrame(frameRef.current);frameRef.current=null;lastRef.current=0;ref.current?.style.setProperty('--edge-proximity','0')},[])
  const start=useCallback(()=>{const card=ref.current;if(!card||frameRef.current!=null)return;card.style.setProperty('--edge-proximity','100');const tick=now=>{if(!lastRef.current)lastRef.current=now;const dt=Math.min((now-lastRef.current)/1000,.05);lastRef.current=now;angleRef.current=(angleRef.current+dt*105)%360;card.style.setProperty('--cursor-angle',`${angleRef.current.toFixed(3)}deg`);frameRef.current=requestAnimationFrame(tick)};frameRef.current=requestAnimationFrame(tick)},[])
  useEffect(()=>stop,[stop])
  return <div ref={ref} onPointerEnter={start} onPointerLeave={stop} className={`border-glow-card ${className}`} style={{'--card-bg':backgroundColor,'--edge-sensitivity':edgeSensitivity,'--border-radius':`${borderRadius}px`,'--glow-padding':`${glowRadius}px`,'--cone-spread':coneSpread,'--fill-opacity':fillOpacity,...glowVars(glowColor,glowIntensity),...gradientVars(colors)}}><span className="edge-light"/><div className="border-glow-inner">{children}</div></div>
}
