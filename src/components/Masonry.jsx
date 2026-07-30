import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import './Masonry.css'

const getColumnCount = () => {
  if (typeof window === 'undefined') return 3
  if (window.matchMedia('(max-width: 580px)').matches) return 1
  if (window.matchMedia('(max-width: 950px)').matches) return 2
  return 3
}

export default function Masonry({
  items = [],
  duration = 0.68,
  stagger = 0.09,
  animateFrom = 'top',
  blurToFocus = true
}) {
  const [columnCount, setColumnCount] = useState(getColumnCount)

  useEffect(() => {
    const update = () => setColumnCount(getColumnCount())
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  const columns = useMemo(() => {
    const result = Array.from({ length: columnCount }, () => [])
    items.forEach((item, index) => result[index % columnCount].push({ ...item, order: index }))
    return result
  }, [items, columnCount])

  const offset = animateFrom === 'top' ? -38 : 38

  return <div className="masonry-list" style={{ '--masonry-columns': columnCount }}>
    {columns.map((column, columnIndex) => <div className="masonry-column" key={`${columnCount}-${columnIndex}`}>
      {column.map(item => <motion.figure
        className="masonry-item"
        key={item.id}
        initial={{ opacity: 0, y: offset, filter: blurToFocus ? 'blur(6px)' : 'none' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{
          duration,
          delay: item.order * stagger,
          ease: [0.2, 0.76, 0.22, 1]
        }}
      >
        {(item.images?.length ? item.images : [{ src: item.img, alt: item.alt }]).map((image, imageIndex) => <img
          key={`${item.id}-${image.src}`}
          src={image.src}
          alt={image.alt || ''}
          loading={imageIndex === 0 ? 'eager' : 'lazy'}
          fetchPriority={item.order < columnCount && imageIndex === 0 ? 'high' : 'auto'}
          decoding="async"
        />)}
      </motion.figure>)}
    </div>)}
  </div>
}
