import { createElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './TextType.css'

export default function TextType({
  text, as: Component = 'div', typingSpeed = 50, initialDelay = 0,
  pauseDuration = 2000, deletingSpeed = 30, loop = true, className = '',
  showCursor = true, hideCursorWhileTyping = false, cursorCharacter = '|',
  cursorClassName = '', cursorBlinkDuration = 0.5, textColors = [], variableSpeed,
  onSentenceComplete, startOnVisible = false, reverseMode = false, ...props
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(!startOnVisible)
  const cursorRef = useRef(null)
  const containerRef = useRef(null)
  const textArray = useMemo(() => Array.isArray(text) ? text : [text], [text])
  const getRandomSpeed = useCallback(() => variableSpeed
    ? Math.random() * (variableSpeed.max - variableSpeed.min) + variableSpeed.min
    : typingSpeed, [variableSpeed, typingSpeed])

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return undefined
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) setIsVisible(true)
    }), { threshold: 0.1 })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [startOnVisible])

  useEffect(() => {
    if (!showCursor || !cursorRef.current) return undefined
    gsap.set(cursorRef.current, { opacity: 1 })
    const tween = gsap.to(cursorRef.current, { opacity: 0, duration: cursorBlinkDuration, repeat: -1, yoyo: true, ease: 'power2.inOut' })
    return () => tween.kill()
  }, [showCursor, cursorBlinkDuration])

  useEffect(() => {
    if (!isVisible) return undefined
    let timeout
    const currentText = textArray[currentTextIndex]
    const processedText = reverseMode ? [...currentText].reverse().join('') : currentText
    const run = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false)
          if (currentTextIndex === textArray.length - 1 && !loop) return
          onSentenceComplete?.(textArray[currentTextIndex], currentTextIndex)
          setCurrentTextIndex(previous => (previous + 1) % textArray.length)
          setCurrentCharIndex(0)
        } else timeout = window.setTimeout(() => setDisplayedText(previous => previous.slice(0, -1)), deletingSpeed)
      } else if (currentCharIndex < processedText.length) {
        timeout = window.setTimeout(() => {
          setDisplayedText(previous => previous + processedText[currentCharIndex])
          setCurrentCharIndex(previous => previous + 1)
        }, getRandomSpeed())
      } else if (loop || currentTextIndex < textArray.length - 1) {
        timeout = window.setTimeout(() => setIsDeleting(true), pauseDuration)
      }
    }
    timeout = window.setTimeout(run, currentCharIndex === 0 && !isDeleting && displayedText === '' ? initialDelay : 0)
    return () => window.clearTimeout(timeout)
  }, [currentCharIndex, displayedText, isDeleting, deletingSpeed, pauseDuration, textArray, currentTextIndex, loop, initialDelay, isVisible, reverseMode, getRandomSpeed, onSentenceComplete])

  const shouldHideCursor = hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting)
  const color = textColors.length ? textColors[currentTextIndex % textColors.length] : 'inherit'
  return createElement(Component, { ref: containerRef, className: `text-type ${className}`, ...props },
    <span className="text-type__content" style={{ color }}>{displayedText}</span>,
    showCursor && <span ref={cursorRef} className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}>{cursorCharacter}</span>
  )
}
