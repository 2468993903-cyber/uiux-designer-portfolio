import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './LogoLoop.css'

const LogoLoop = memo(({ items, renderItem, speed = 20, hoverSpeed = 0, className = '', ariaLabel = '循环内容' }) => {
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const sequenceRef = useRef(null)
  const frameRef = useRef(null)
  const lastRef = useRef(null)
  const offsetRef = useRef(0)
  const velocityRef = useRef(0)
  const [sequenceWidth, setSequenceWidth] = useState(0)
  const [copies, setCopies] = useState(2)
  const [hovered, setHovered] = useState(false)

  const measure = useCallback(() => {
    const width = sequenceRef.current?.getBoundingClientRect().width ?? 0
    const viewport = rootRef.current?.clientWidth ?? 0
    if (!width) return
    const rounded = Math.ceil(width)
    setSequenceWidth(rounded)
    setCopies(Math.max(2, Math.ceil(viewport / rounded) + 2))
  }, [])

  useEffect(() => {
    measure()
    const observer = new ResizeObserver(measure)
    if (rootRef.current) observer.observe(rootRef.current)
    if (sequenceRef.current) observer.observe(sequenceRef.current)
    const images = sequenceRef.current?.querySelectorAll('img') ?? []
    images.forEach(image => {
      if (!image.complete) image.addEventListener('load', measure, { once: true })
    })
    return () => observer.disconnect()
  }, [items, measure])

  useEffect(() => {
    const animate = timestamp => {
      if (lastRef.current === null) lastRef.current = timestamp
      const delta = Math.max(0, timestamp - lastRef.current) / 1000
      lastRef.current = timestamp
      const target = hovered ? hoverSpeed : speed
      velocityRef.current += (target - velocityRef.current) * (1 - Math.exp(-delta / 0.3))
      if (sequenceWidth > 0 && trackRef.current) {
        offsetRef.current = ((offsetRef.current + velocityRef.current * delta) % sequenceWidth + sequenceWidth) % sequenceWidth
        trackRef.current.style.transform = `translate3d(${-offsetRef.current}px,0,0)`
      }
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      lastRef.current = null
    }
  }, [hoverSpeed, hovered, sequenceWidth, speed])

  const lists = useMemo(() => Array.from({ length: copies }, (_, copyIndex) => <ul className="logoloop__list" key={copyIndex} ref={copyIndex === 0 ? sequenceRef : undefined} aria-hidden={copyIndex > 0}>
    {items.map((item, index) => <li className="logoloop__item" key={`${copyIndex}-${index}`}>{renderItem(item)}</li>)}
  </ul>), [copies, items, renderItem])

  return <div className={`logoloop ${className}`} ref={rootRef} role="region" aria-label={ariaLabel}>
    <div className="logoloop__track" ref={trackRef} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>{lists}</div>
  </div>
})

LogoLoop.displayName = 'LogoLoop'
export default LogoLoop
