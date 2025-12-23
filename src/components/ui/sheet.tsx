import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface SheetContentProps {
  side?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
  children: React.ReactNode
}

const SheetContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  open: false,
  onOpenChange: () => {},
})

export function Sheet({ open = false, onOpenChange = () => {}, children }: SheetProps) {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

export function SheetContent({ side = 'right', className, children }: SheetContentProps) {
  const { open, onOpenChange } = React.useContext(SheetContext)

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  const sideStyles = {
    left: 'left-0 top-0 h-full animate-in slide-in-from-left',
    right: 'right-0 top-0 h-full animate-in slide-in-from-right',
    top: 'top-0 left-0 w-full animate-in slide-in-from-top',
    bottom: 'bottom-0 left-0 w-full animate-in slide-in-from-bottom',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet Content */}
      <div
        className={cn(
          'fixed z-50 bg-background shadow-lg',
          sideStyles[side],
          className
        )}
      >
        <div className="relative h-full">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          {children}
        </div>
      </div>
    </>
  )
}

export function SheetHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('flex flex-col space-y-2 text-center sm:text-left p-6', className)}>
      {children}
    </div>
  )
}

export function SheetTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h2 className={cn('text-lg font-semibold text-foreground', className)}>
      {children}
    </h2>
  )
}

export function SheetDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  )
}
