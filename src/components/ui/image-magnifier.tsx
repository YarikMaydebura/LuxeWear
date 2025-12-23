import { useState, useRef, MouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface ImageMagnifierProps {
  src: string
  alt: string
  className?: string
  magnifierSize?: number
  zoomLevel?: number
}

export function ImageMagnifier({
  src,
  alt,
  className,
  magnifierSize = 150,
  zoomLevel = 2.5,
}: ImageMagnifierProps) {
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 })
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    // Get cursor position relative to container
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate magnifier position (centered on cursor)
    setMagnifierPosition({
      x: x - magnifierSize / 2,
      y: y - magnifierSize / 2,
    })

    // Calculate background position for zoom effect
    const bgX = (x / rect.width) * 100
    const bgY = (y / rect.height) * 100
    setBackgroundPosition({ x: bgX, y: bgY })
  }

  const handleMouseEnter = () => setShowMagnifier(true)
  const handleMouseLeave = () => setShowMagnifier(false)

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden cursor-crosshair', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base image */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />

      {/* Magnifier lens */}
      {showMagnifier && (
        <div
          className="absolute pointer-events-none rounded-full border-2 border-white shadow-xl z-10"
          style={{
            width: magnifierSize,
            height: magnifierSize,
            left: magnifierPosition.x,
            top: magnifierPosition.y,
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: `${backgroundPosition.x}% ${backgroundPosition.y}%`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
    </div>
  )
}

interface ImageZoomOnHoverProps {
  src: string
  alt: string
  className?: string
  zoomScale?: number
}

export function ImageZoomOnHover({
  src,
  alt,
  className,
  zoomScale = 1.5,
}: ImageZoomOnHoverProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [transformOrigin, setTransformOrigin] = useState('center center')
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isHovered) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setTransformOrigin(`${x}% ${y}%`)
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 ease-out"
        style={{
          transform: isHovered ? `scale(${zoomScale})` : 'scale(1)',
          transformOrigin,
        }}
      />
    </div>
  )
}
