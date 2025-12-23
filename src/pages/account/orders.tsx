import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ChevronLeft, Search, Filter } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useOrderStore } from '@/store/order-store'
import type { OrderStatus } from '@/types'

const statusFilters: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All Orders', value: 'all' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
]

export function OrdersPage() {
  const { user } = useAuth()
  const orders = useOrderStore((state) => state.orders)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const userOrders = user ? orders.filter((o) => o.userId === user.id) : []

  const filteredOrders = userOrders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesSearch =
      searchQuery === '' ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    return matchesStatus && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Link */}
        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Account
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-light tracking-wide">My Orders</h1>
            <p className="text-muted-foreground">
              {userOrders.length} order{userOrders.length !== 1 ? 's' : ''} total
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                statusFilter === filter.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-stone-100 text-foreground hover:bg-stone-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-border rounded-lg overflow-hidden"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-stone-50 border-b border-border">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Order ID: </span>
                      <span className="font-medium">{order.id}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date: </span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total: </span>
                      <span className="font-medium">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <span
                    className={`self-start sm:self-auto text-xs px-3 py-1 rounded-full font-medium ${
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

                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-4">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.cartItemId} className="flex gap-4">
                        <div className="w-16 h-16 bg-stone-100 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                            {item.selectedSize && item.selectedColor && ' • '}
                            {item.selectedColor && `Color: ${item.selectedColor}`}
                          </p>
                          <p className="text-sm">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-muted-foreground">
                        +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                    <Link
                      to={`/account/orders/${order.id}`}
                      className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-stone-50 transition-colors"
                    >
                      View Details
                    </Link>
                    {order.status === 'delivered' && (
                      <button className="px-4 py-2 text-sm font-medium text-primary hover:underline">
                        Buy Again
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-stone-50 rounded-lg p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No orders found</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : "You haven't placed any orders yet"}
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
