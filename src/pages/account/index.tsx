import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Package, MapPin, Settings, Heart, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useOrderStore } from '@/store/order-store'
import { useWishlistStore } from '@/store/wishlist-store'

const menuItems = [
  {
    icon: Package,
    label: 'Orders',
    description: 'Track, return, or buy things again',
    href: '/account/orders',
  },
  {
    icon: MapPin,
    label: 'Addresses',
    description: 'Edit addresses for orders',
    href: '/account/addresses',
  },
  {
    icon: Heart,
    label: 'Wishlist',
    description: 'View your saved items',
    href: '/wishlist',
  },
  {
    icon: Settings,
    label: 'Account Settings',
    description: 'Edit your profile and password',
    href: '/account/settings',
  },
]

export function AccountPage() {
  const { user, fullName, initials } = useAuth()
  const orders = useOrderStore((state) => state.orders)
  const wishlistCount = useWishlistStore((state) => state.getItemCount())

  const userOrders = user ? orders.filter((o) => o.userId === user.id) : []
  const recentOrders = userOrders.slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center gap-6 mb-8 lg:mb-12">
          <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-medium">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-light tracking-wide">
              Hello, {user?.firstName}
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-stone-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-medium">{userOrders.length}</p>
                <p className="text-sm text-muted-foreground">Orders</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-medium">{wishlistCount}</p>
                <p className="text-sm text-muted-foreground">Wishlist</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-medium">
                  {userOrders.filter((o) => o.status === 'delivered').length}
                </p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Recent Orders</h2>
                <Link
                  to="/account/orders"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      to={`/account/orders/${order.id}`}
                      className="block bg-white border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{order.id}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-stone-50 rounded-lg p-8 text-center">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Link
                    to="/shop"
                    className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Menu */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium mb-4">Account Menu</h2>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-4 p-4 bg-white border border-border rounded-lg hover:border-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
