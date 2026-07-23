import { useEffect, useRef } from 'react'
import './FluidGlassCursor.css'

export default function FluidGlassCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) return undefined

    const onMove = event => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`
      cursor.classList.add('is-visible')
    }
    const onDown = () => cursor.classList.add('is-pressed')
    const onUp = () => cursor.classList.remove('is-pressed')
    const onLeave = () => cursor.classList.remove('is-visible')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <div ref={cursorRef} className="fluid-glass-cursor" aria-hidden="true">
    <span className="fluid-glass-cursor__refraction" />
    <span className="fluid-glass-cursor__glint" />
    <span className="fluid-glass-cursor__core" />
  </div>
}
