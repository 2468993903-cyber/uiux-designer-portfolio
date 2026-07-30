import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import './CardSwap.css'

export const Card = forwardRef(({ customClass = '', ...rest }, ref) => (
  <article ref={ref} {...rest} className={`card-swap-card ${customClass} ${rest.className ?? ''}`.trim()} />
))

Card.displayName = 'Card'

const makeSlot = (index, distanceX, distanceY, total) => ({
  x: index * distanceX,
  y: -index * distanceY,
  z: -index * distanceX * 1.3,
  zIndex: total - index,
})

const placeNow = (element, slot, skew) => gsap.set(element, {
  x: slot.x,
  y: slot.y,
  z: slot.z,
  xPercent: -50,
  yPercent: -50,
  skewY: skew,
  transformOrigin: 'center center',
  zIndex: slot.zIndex,
  force3D: true,
})

export default function CardSwap({
  width = 620,
  height = 430,
  cardDistance = 48,
  verticalDistance = 44,
  delay = 5200,
  manualResumeDelay = 5000,
  pauseOnHover = true,
  onCardClick,
  onActiveChange,
  selectionRequest,
  skewAmount = 2.5,
  children,
}) {
  const childArray = useMemo(() => Children.toArray(children), [children])
  const refs = useMemo(() => childArray.map(() => React.createRef()), [childArray.length])
  const order = useRef(Array.from({ length: childArray.length }, (_, index) => index))
  const timelineRef = useRef(null)
  const intervalRef = useRef()
  const resumeTimeoutRef = useRef()
  const restartIntervalRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const total = refs.length
    refs.forEach((ref, index) => placeNow(ref.current, makeSlot(index, cardDistance, verticalDistance, total), skewAmount))

    const swap = () => {
      if (order.current.length < 2 || timelineRef.current?.isActive()) return
      const [front, ...rest] = order.current
      const frontElement = refs[front].current
      const timeline = gsap.timeline()
      timelineRef.current = timeline
      onActiveChange?.(rest[0])

      timeline.to(frontElement, { y: '+=460', duration: .72, ease: 'power2.inOut' })
      timeline.addLabel('promote', '-=.5')
      rest.forEach((index, position) => {
        const slot = makeSlot(position, cardDistance, verticalDistance, total)
        timeline.set(refs[index].current, { zIndex: slot.zIndex }, 'promote')
        timeline.to(refs[index].current, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: .72,
          ease: 'power2.inOut',
        }, `promote+=${position * .08}`)
      })

      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total)
      timeline.set(frontElement, { zIndex: backSlot.zIndex })
      timeline.to(frontElement, {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        duration: .8,
        ease: 'power2.out',
      })
      timeline.call(() => {
        order.current = [...rest, front]
      })
    }

    const restartInterval = () => {
      window.clearTimeout(resumeTimeoutRef.current)
      window.clearInterval(intervalRef.current)
      intervalRef.current = window.setInterval(swap, delay)
    }
    const restartAfterManualSelection = () => {
      window.clearTimeout(resumeTimeoutRef.current)
      window.clearInterval(intervalRef.current)
      resumeTimeoutRef.current = window.setTimeout(() => {
        swap()
        intervalRef.current = window.setInterval(swap, delay)
      }, manualResumeDelay)
    }
    restartIntervalRef.current = restartAfterManualSelection
    restartInterval()
    const node = containerRef.current
    const pause = () => {
      timelineRef.current?.pause()
      window.clearInterval(intervalRef.current)
    }
    const resume = () => {
      timelineRef.current?.play()
      restartInterval()
    }
    if (pauseOnHover) {
      node.addEventListener('mouseenter', pause)
      node.addEventListener('mouseleave', resume)
    }

    return () => {
      window.clearTimeout(resumeTimeoutRef.current)
      window.clearInterval(intervalRef.current)
      restartIntervalRef.current = null
      timelineRef.current?.kill()
      if (pauseOnHover) {
        node.removeEventListener('mouseenter', pause)
        node.removeEventListener('mouseleave', resume)
      }
    }
  }, [cardDistance, verticalDistance, delay, manualResumeDelay, pauseOnHover, skewAmount, refs, onActiveChange])

  useEffect(() => {
    const selectedIndex = selectionRequest?.index
    if (!Number.isInteger(selectedIndex) || !refs[selectedIndex]) return
    const currentPosition = order.current.indexOf(selectedIndex)
    if (currentPosition < 0) return
    restartIntervalRef.current?.()
    onActiveChange?.(selectedIndex)

    timelineRef.current?.kill()
    const total = refs.length
    const nextOrder = [selectedIndex, ...order.current.filter(index => index !== selectedIndex)]
    const timeline = gsap.timeline({
      onComplete: () => { order.current = nextOrder },
    })
    timelineRef.current = timeline

    nextOrder.forEach((cardIndex, position) => {
      const slot = makeSlot(position, cardDistance, verticalDistance, total)
      timeline.set(refs[cardIndex].current, { zIndex: slot.zIndex }, 0)
      timeline.to(refs[cardIndex].current, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        skewY: skewAmount,
        duration: .72,
        ease: 'power2.inOut',
      }, 0)
    })
  }, [cardDistance, onActiveChange, refs, selectionRequest, skewAmount, verticalDistance])

  const rendered = childArray.map((child, index) => isValidElement(child)
    ? cloneElement(child, {
      key: child.key ?? index,
      ref: refs[index],
      style: { width, height, ...(child.props.style ?? {}) },
      onClick: event => {
        child.props.onClick?.(event)
        onCardClick?.(index)
      },
    })
    : child)

  return <div ref={containerRef} className="card-swap-container" style={{ width, height }}>{rendered}</div>
}
