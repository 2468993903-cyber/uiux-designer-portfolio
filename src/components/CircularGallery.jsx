import { useEffect, useMemo, useRef, useState } from 'react'
import './CircularGallery.css'

const wrap = (value, length) => ((value % length) + length) % length

export default function CircularGallery({ items = [], bend = 3, scrollSpeed = 1.8, scrollEase = 0.08, onPreview, onSelect }) {
  const rootRef = useRef(null)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const dragRef = useRef({ active: false, x: 0, start: 0 })
  const rafRef = useRef(0)
  const startAnimationRef = useRef(() => {})
  const [, render] = useState(0)

  useEffect(() => {
    const tick = () => {
      const delta = targetRef.current - currentRef.current
      if (Math.abs(delta) < .001) {
        currentRef.current = targetRef.current
        rafRef.current = 0
        render(value => value + 1)
        return
      }
      currentRef.current += delta * scrollEase
      render(value => value + 1)
      rafRef.current = requestAnimationFrame(tick)
    }
    startAnimationRef.current = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick)
    }
    startAnimationRef.current()
    return () => cancelAnimationFrame(rafRef.current)
  }, [scrollEase])

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const onWheel = event => {
      event.preventDefault()
      targetRef.current += Math.sign(event.deltaY || event.deltaX) * scrollSpeed
      startAnimationRef.current()
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [scrollSpeed])

  const cards = useMemo(() => items.map((item, index) => ({ ...item, index })), [items])
  const current = currentRef.current

  const beginDrag = event => {
    dragRef.current = { active: true, x: event.clientX, start: targetRef.current }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }
  const moveDrag = event => {
    if (!dragRef.current.active) return
    targetRef.current = dragRef.current.start + (dragRef.current.x - event.clientX) / 150
    startAnimationRef.current()
  }
  const endDrag = () => {
    dragRef.current.active = false
    targetRef.current = Math.round(targetRef.current)
    startAnimationRef.current()
  }

  return <div
    ref={rootRef}
    className="circular-gallery"
    role="region"
    aria-label="农业农村项目画廊，可拖动或滚动浏览"
    tabIndex={0}
    onPointerDown={beginDrag}
    onPointerMove={moveDrag}
    onPointerUp={endDrag}
    onPointerCancel={endDrag}
    onKeyDown={event => {
      if (event.key === 'ArrowRight') {
        targetRef.current += 1
        startAnimationRef.current()
      }
      if (event.key === 'ArrowLeft') {
        targetRef.current -= 1
        startAnimationRef.current()
      }
    }}
  >
    <div className="circular-gallery__ambient" />
    <div className="circular-gallery__track">
      {cards.map((item, index) => {
        let offset = wrap(index - current + items.length / 2, items.length) - items.length / 2
        const distance = Math.abs(offset)
        const angle = offset * 13
        const x = offset * 250
        const y = Math.pow(distance, 1.55) * bend * 10
        const scale = Math.max(.72, 1 - distance * .085)
        return <button
          type="button"
          className={`circular-gallery__card${distance < .55 ? ' is-center' : ''}`}
          key={item.text}
          style={{ '--x': `${x}px`, '--y': `${y}px`, '--r': `${angle}deg`, '--s': scale, '--z': Math.round(20 - distance * 3), '--opacity': Math.max(.42, 1 - distance * .15) }}
          onPointerEnter={() => onPreview?.(item)}
          onFocus={() => onPreview?.(item)}
          onClick={() => {
            targetRef.current += offset
            startAnimationRef.current()
            onSelect?.(item)
          }}
        >
          <img src={item.image} alt="" draggable="false" />
          <span className="circular-gallery__shade" />
          <span className="circular-gallery__frame" aria-hidden="true" />
          <span className="circular-gallery__number"><small>NO.</small><b>{String(index + 1).padStart(2, '0')}</b></span>
          <span className="circular-gallery__copy">
            <small><i />{item.en}</small>
            <strong>{item.text}</strong>
            <span>探索项目 <b>↗</b></span>
          </span>
        </button>
      })}
    </div>
  </div>
}
