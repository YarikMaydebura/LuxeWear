import { useScrollAnimation, useCountUp } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
  decimals?: number
}

export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2000,
  className,
  decimals = 0,
}: AnimatedCounterProps) {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.5, triggerOnce: true })
  const count = useCountUp(end, { duration, enabled: isInView })

  const displayValue = decimals > 0
    ? count.toFixed(decimals)
    : count.toLocaleString()

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}{displayValue}{suffix}
    </span>
  )
}

interface StatCardProps {
  value: number | string
  label: string
  suffix?: string
  prefix?: string
  className?: string
}

export function AnimatedStatCard({
  value,
  label,
  suffix = '',
  prefix = '',
  className,
}: StatCardProps) {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.5, triggerOnce: true })

  // Parse numeric value for animation
  const numericValue = typeof value === 'string'
    ? parseFloat(value.replace(/[^0-9.]/g, ''))
    : value

  const count = useCountUp(numericValue, { duration: 2000, enabled: isInView })

  // Handle special cases like "10+" or "50K+"
  const formatValue = () => {
    if (typeof value === 'string') {
      if (value.includes('K')) {
        return `${count}K`
      }
      if (value.includes('%')) {
        return `${count}%`
      }
      if (value.includes('+')) {
        return `${count}+`
      }
      if (value.includes('/')) {
        // For values like "24/7"
        return value
      }
    }
    return count.toLocaleString()
  }

  return (
    <div ref={ref} className={cn('text-center', className)}>
      <p className="text-4xl lg:text-5xl font-heading text-primary mb-2 tabular-nums">
        {prefix}{formatValue()}{suffix}
      </p>
      <p className="text-stone-400 text-sm">{label}</p>
    </div>
  )
}
