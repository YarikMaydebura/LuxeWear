import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { label: 'Women', href: '/shop/womens-clothing' },
  { label: 'Men', href: '/shop/mens-clothing' },
  { label: 'Accessories', href: '/shop/jewelery' },
  { label: 'Sale', href: '/shop/sale', highlight: true },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-background z-50 shadow-xl lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-xl font-heading font-light">Menu</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className={`block px-4 py-3 rounded-md transition-colors ${
                          item.highlight
                            ? 'text-destructive hover:bg-destructive/10'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  © 2024 Luxe Wear
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
