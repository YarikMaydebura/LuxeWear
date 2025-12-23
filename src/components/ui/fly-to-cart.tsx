import { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FlyingItem {
  id: string
  imageUrl: string
  startX: number
  startY: number
}

interface FlyToCartContextType {
  cartIconRef: React.RefObject<HTMLElement>
  registerCartIcon: (ref: HTMLElement | null) => void
  triggerFlyAnimation: (imageUrl: string, startElement: HTMLElement) => void
}

const FlyToCartContext = createContext<FlyToCartContextType | null>(null)

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const cartIconRef = useRef<HTMLElement>(null)
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([])

  const registerCartIcon = useCallback((ref: HTMLElement | null) => {
    if (ref) {
      (cartIconRef as React.MutableRefObject<HTMLElement | null>).current = ref
    }
  }, [])

  const triggerFlyAnimation = useCallback((imageUrl: string, startElement: HTMLElement) => {
    if (!cartIconRef.current) return

    const startRect = startElement.getBoundingClientRect()
    const id = `fly-${Date.now()}`

    setFlyingItems(prev => [
      ...prev,
      {
        id,
        imageUrl,
        startX: startRect.left + startRect.width / 2,
        startY: startRect.top + startRect.height / 2,
      }
    ])

    // Remove after animation completes
    setTimeout(() => {
      setFlyingItems(prev => prev.filter(item => item.id !== id))
    }, 800)
  }, [])

  const cartRect = cartIconRef.current?.getBoundingClientRect()

  return (
    <FlyToCartContext.Provider value={{ cartIconRef, registerCartIcon, triggerFlyAnimation }}>
      {children}
      <AnimatePresence>
        {flyingItems.map(item => (
          <motion.div
            key={item.id}
            className="fixed pointer-events-none z-[100]"
            initial={{
              x: item.startX - 30,
              y: item.startY - 30,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: cartRect ? cartRect.left + cartRect.width / 2 - 15 : item.startX,
              y: cartRect ? cartRect.top + cartRect.height / 2 - 15 : item.startY,
              scale: 0.3,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <div className="w-[60px] h-[60px] rounded-full overflow-hidden bg-white shadow-xl border-2 border-primary">
              <img
                src={item.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </FlyToCartContext.Provider>
  )
}

export function useFlyToCart() {
  const context = useContext(FlyToCartContext)
  if (!context) {
    throw new Error('useFlyToCart must be used within FlyToCartProvider')
  }
  return context
}

// Component to wrap the cart icon
export function CartIconWrapper({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const { registerCartIcon } = useFlyToCart()

  return (
    <span ref={registerCartIcon as React.RefCallback<HTMLSpanElement>} className={className}>
      {children}
    </span>
  )
}
