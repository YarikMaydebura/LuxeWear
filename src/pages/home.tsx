import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useFeaturedProducts, useNewArrivals, useBestSellers } from '@/hooks/use-products'
import { useCategories } from '@/hooks/use-categories'
import { ProductCard } from '@/components/products/product-card'
import {
  containerVariants,
  fadeInUpVariants,
  heroTextVariants,
  heroCTAVariants,
} from '@/lib/animations'
import { ArrowRight, Sparkles, TrendingUp, Clock } from 'lucide-react'

export function HomePage() {
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts(8)
  const { data: newArrivals, isLoading: newArrivalsLoading } = useNewArrivals(4)
  const { data: bestSellers, isLoading: bestSellersLoading } = useBestSellers(4)
  const { data: categories } = useCategories()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] lg:h-[700px] flex items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/30 overflow-hidden">
        <motion.div
          className="container mx-auto px-4 text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={heroTextVariants}
            className="text-5xl lg:text-7xl xl:text-8xl font-heading font-light mb-6 text-stone-900"
          >
            Timeless Elegance
          </motion.h1>
          <motion.p
            variants={fadeInUpVariants}
            className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Discover our curated collection of premium fashion pieces crafted for the modern lifestyle
          </motion.p>
          <motion.div variants={heroCTAVariants}>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Shop Collection
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(217,119,6,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(245,158,11,0.08),transparent_50%)]" />
      </section>

      {/* Featured Categories */}
      {categories && categories.length > 0 && (
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
          >
            <motion.h2
              variants={fadeInUpVariants}
              className="text-4xl font-heading font-light mb-12 text-center"
            >
              Shop by Category
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.slice(0, 3).map((category) => (
                <motion.div
                  key={category.id}
                  variants={fadeInUpVariants}
                  whileHover={{ scale: 1.02 }}
                  className="group relative h-[400px] rounded-lg overflow-hidden cursor-pointer"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-heading font-light mb-2">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-stone-200">
                      Explore Collection
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-transparent via-amber-50/20 to-transparent">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.div variants={fadeInUpVariants} className="flex items-center justify-center gap-3 mb-12">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-4xl font-heading font-light text-center">
              New Arrivals
            </h2>
          </motion.div>

          {newArrivalsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <motion.div variants={fadeInUpVariants} className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-stone-900 text-stone-900 rounded-md hover:bg-stone-900 hover:text-white transition-colors"
            >
              View All New Arrivals
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Promo Banner */}
      <section className="bg-stone-900 text-stone-50 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpVariants}
          className="container mx-auto px-4 text-center"
        >
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-4" />
          <h2 className="text-3xl font-heading font-light mb-3">
            Free Shipping on Orders Over $100
          </h2>
          <p className="text-stone-300 text-lg">
            Enjoy complimentary shipping on all qualifying orders
          </p>
        </motion.div>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.div variants={fadeInUpVariants} className="flex items-center justify-center gap-3 mb-12">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-4xl font-heading font-light text-center">
              Best Sellers
            </h2>
          </motion.div>

          {bestSellersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-transparent via-stone-50 to-transparent">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.h2
            variants={fadeInUpVariants}
            className="text-4xl font-heading font-light mb-12 text-center"
          >
            Featured Collection
          </motion.h2>

          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </motion.div>
      </section>
    </div>
  )
}

