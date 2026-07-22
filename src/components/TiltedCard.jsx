import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import './TiltedCard.css'

const springValues = {
  damping: 28,
  stiffness: 170,
  mass: 0.85
}

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  containerHeight = '100%',
  containerWidth = '100%',
  imageHeight = '100%',
  imageWidth = '100%',
  scaleOnHover = 1.015,
  rotateAmplitude = 7,
  overlayContent = null,
  displayOverlayContent = false,
  className = ''
}) {
  const ref = useRef(null)
  const rotateX = useSpring(useMotionValue(0), springValues)
  const rotateY = useSpring(useMotionValue(0), springValues)
  const scale = useSpring(1, springValues)

  function handleMouse(event) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = event.clientX - rect.left - rect.width / 2
    const offsetY = event.clientY - rect.top - rect.height / 2
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude)
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude)
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover)
  }

  function handleMouseLeave() {
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
  }

  return <figure
    ref={ref}
    className={`tilted-card-figure ${className}`.trim()}
    style={{ height: containerHeight, width: containerWidth }}
    onMouseMove={handleMouse}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    <motion.div
      className="tilted-card-inner"
      style={{ width: imageWidth, height: imageHeight, rotateX, rotateY, scale }}
    >
      <motion.img src={imageSrc} alt={altText} className="tilted-card-img" />
      {displayOverlayContent && overlayContent && <motion.div className="tilted-card-overlay">{overlayContent}</motion.div>}
    </motion.div>
  </figure>
}
