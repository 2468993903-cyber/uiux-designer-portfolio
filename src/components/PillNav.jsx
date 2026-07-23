import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './PillNav.css'

export default function PillNav({ items, activeId, onSelect, className = '', ariaLabel = '作品分类' }) {
  const isSubNav = className.includes('pill-filter-nav--sub')
  const activeIndex = Math.max(0, items.findIndex(item => item.id === activeId))
  const circleRefs = useRef([])
  const timelineRefs = useRef([])
  const tweenRefs = useRef([])

  useLayoutEffect(() => {
    const setup = () => {
      circleRefs.current.forEach((circle, index) => {
        const button = circle?.parentElement
        if (!button) return
        const { width, height } = button.getBoundingClientRect()
        const radius = ((width * width) / 4 + height * height) / (2 * height)
        const diameter = Math.ceil(radius * 2) + 2
        const bottom = Math.ceil(radius - Math.sqrt(Math.max(0, radius * radius - (width * width) / 4))) + 1
        const primary = button.querySelector('.pill-filter__primary')
        const hover = button.querySelector('.pill-filter__hover')
        gsap.set(circle, { width: diameter, height: diameter, bottom: -bottom, xPercent: -50, scale: 0, rotation: 0, transformOrigin: `50% ${diameter - bottom}px` })
        gsap.set(primary, { y: 0 })
        gsap.set(hover, { y: height + 16, opacity: 0 })
        timelineRefs.current[index]?.kill()
        timelineRefs.current[index] = gsap.timeline({ paused: true })
          .to(circle, { scale: .66, rotation: 0, duration: .76, ease: 'back.out(1.28)' }, 0)
          .to(primary, { y: -(height + 10), duration: .72, ease: 'power3.out' }, 0)
          .to(hover, { y: 0, opacity: 1, duration: .76, ease: 'power3.out' }, 0)
      })
    }
    setup()
    window.addEventListener('resize', setup)
    return () => {
      window.removeEventListener('resize', setup)
      timelineRefs.current.forEach(timeline => timeline?.kill())
      tweenRefs.current.forEach(tween => tween?.kill())
    }
  }, [items])

  const animate = (index, forward) => {
    const timeline = timelineRefs.current[index]
    if (!timeline) return
    tweenRefs.current[index]?.kill()
    tweenRefs.current[index] = timeline.tweenTo(forward ? timeline.duration() : 0, { duration: forward ? .32 : .24, ease: 'power3.out', overwrite: 'auto' })
  }

  const resetAll = () => {
    timelineRefs.current.forEach((timeline, index) => {
      if (!timeline) return
      tweenRefs.current[index]?.kill()
      tweenRefs.current[index] = timeline.tweenTo(0, { duration: .2, ease: 'power3.out', overwrite: 'auto' })
    })
  }

  if (isSubNav) {
    return <nav className={`pill-filter-nav ${className}`.trim()} style={{ '--pill-active-index': activeIndex }} aria-label={ariaLabel} role="tablist">
      <span className="pill-filter-nav__slider" aria-hidden="true" />
      {items.map(item => <button key={item.id} className={`pill-filter${activeId === item.id ? ' is-active' : ''}`} type="button" role="tab" aria-selected={activeId === item.id} onClick={() => onSelect(item.id)}>
        <span className="pill-filter__label"><b>{item.label}</b></span>
      </button>)}
    </nav>
  }

  return <nav className={`pill-filter-nav ${className}`.trim()} aria-label={ariaLabel} role="tablist" onPointerLeave={resetAll}>
    {items.map((item, index) => <button key={item.id} className={`pill-filter${activeId === item.id ? ' is-active' : ''}`} type="button" role="tab" aria-selected={activeId === item.id} onClick={() => { animate(index, false); onSelect(item.id) }} onPointerEnter={() => animate(index, true)} onPointerLeave={() => animate(index, false)} onBlur={() => animate(index, false)}>
      <span ref={element => { circleRefs.current[index] = element }} className="pill-filter__circle" aria-hidden="true" />
      <span className="pill-filter__stack">
        <span className="pill-filter__primary"><b>{item.label}</b><i>{item.en}</i></span>
        <span className="pill-filter__hover" aria-hidden="true"><b>{item.label}</b><i>{item.en}</i></span>
      </span>
    </button>)}
  </nav>
}
