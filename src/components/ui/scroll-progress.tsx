import { motion } from 'framer-motion'
import { useScrollProgress } from '@/hooks/use-scroll-animation'

interface ScrollProgressProps {
  color?: string
  height?: number
  position?: 'top' | 'bottom'
  showPercentage?: boolean
}

export function ScrollProgress({
  color = 'bg-primary',
  height = 3,
  position = 'top',
  showPercentage = false,
}: ScrollProgressProps) {
  const progress = useScrollProgress()

  return (
    <div
      className={`fixed left-0 right-0 z-50 ${position === 'top' ? 'top-0' : 'bottom-0'}`}
      style={{ height: `${height}px` }}
    >
      <motion.div
        className={`h-full ${color}`}
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
      {showPercentage && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-primary">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  )
}
