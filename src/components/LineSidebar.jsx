import { useRef, useState, useCallback, useEffect } from 'react'
import './LineSidebar.css'

const curves={linear:p=>p,smooth:p=>p*p*(3-2*p),sharp:p=>p*p*p}

export default function LineSidebar({items=[],accentColor='#ff5a2a',textColor='#aaa',markerColor='#444',proximityRadius=110,maxShift=22,falloff='smooth',markerLength=58,itemGap=34,fontSize=.98,smoothing=110,defaultActive=0,onItemClick}){
  const listRef=useRef(null),itemRefs=useRef([]),targets=useRef([]),current=useRef([]),frame=useRef(null),last=useRef(0),activeRef=useRef(defaultActive)
  const [active,setActive]=useState(defaultActive);activeRef.current=active
  const run=useCallback(now=>{const dt=Math.min((now-last.current)/1000,.05),k=1-Math.exp(-dt/(Math.max(smoothing,1)/1000));last.current=now;let moving=false;itemRefs.current.forEach((el,i)=>{if(!el)return;const target=Math.max(targets.current[i]||0,activeRef.current===i?1:0),value=current.current[i]||0,next=value+(target-value)*k,settled=Math.abs(target-next)<.0015;current.current[i]=settled?target:next;el.style.setProperty('--effect',current.current[i].toFixed(4));if(!settled)moving=true});frame.current=moving?requestAnimationFrame(run):null},[smoothing])
  const start=useCallback(()=>{if(frame.current!=null)return;last.current=performance.now();frame.current=requestAnimationFrame(run)},[run])
  const move=useCallback(event=>{const list=listRef.current;if(!list)return;const y=event.clientY-list.getBoundingClientRect().top,ease=curves[falloff]||curves.linear;itemRefs.current.forEach((el,i)=>{if(!el)return;targets.current[i]=ease(Math.max(0,1-Math.abs(y-(el.offsetTop+el.offsetHeight/2))/proximityRadius))});start()},[falloff,proximityRadius,start])
  const leave=useCallback(()=>{targets.current=targets.current.map(()=>0);start()},[start])
  useEffect(()=>start(),[active,start]);useEffect(()=>()=>frame.current!=null&&cancelAnimationFrame(frame.current),[])
  return <nav className="line-sidebar" style={{'--accent':accentColor,'--text':textColor,'--marker':markerColor,'--length':`${markerLength}px`,'--gap':`${itemGap}px`,'--shift':`${maxShift}px`,'--size':`${fontSize}rem`}}><ul ref={listRef} onPointerMove={move} onPointerLeave={leave}>{items.map((label,index)=><li key={label} ref={el=>{itemRefs.current[index]=el}} aria-current={active===index?'true':undefined} onClick={()=>{setActive(index);onItemClick?.(index,label)}}><i/><span><b>{String(index+1).padStart(2,'0')}</b>{label}</span></li>)}</ul></nav>
}
