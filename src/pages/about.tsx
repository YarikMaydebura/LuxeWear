import { motion } from 'framer-motion'
import { Leaf, Award, Heart, Sparkles } from 'lucide-react'
import { fadeInVariants, fadeInUpVariants } from '@/lib/animations'
import { AnimatedStatCard } from '@/components/ui/animated-counter'

const values = [
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'We are committed to sustainable practices, from sourcing eco-friendly materials to reducing our carbon footprint in every step of production.',
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'Each piece is crafted with meticulous attention to detail, using only the finest materials to ensure lasting beauty and durability.',
  },
  {
    icon: Heart,
    title: 'Craftsmanship',
    description: 'Our artisans bring decades of experience and passion to every garment, blending traditional techniques with modern innovation.',
  },
  {
    icon: Sparkles,
    title: 'Timeless Design',
    description: 'We create pieces that transcend trends, focusing on elegant silhouettes and classic details that remain stylish for years to come.',
  },
]

const stats = [
  { value: '10+', label: 'Years of Excellence' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '100%', label: 'Sustainable Materials' },
  { value: '24/7', label: 'Customer Support' },
]

export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920)',
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl lg:text-7xl font-heading font-light mb-4"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl lg:text-2xl font-light max-w-2xl mx-auto"
          >
            Crafting timeless elegance since 2014
          </motion.p>
        </div>
      </motion.section>

      {/* Brand Story Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Who We Are
              </span>
              <h2 className="text-4xl lg:text-5xl font-heading font-light mt-4 mb-6">
                A Legacy of Luxury
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2014, Luxe Wear began with a simple vision: to create clothing that
                  embodies both luxury and conscience. Our founders, passionate about fashion and
                  sustainability, set out to prove that elegance doesn't have to come at the
                  expense of our planet.
                </p>
                <p>
                  Today, we work with skilled artisans around the world, combining traditional
                  craftsmanship with innovative sustainable practices. Every piece in our collection
                  tells a story of dedication, quality, and respect for both people and the environment.
                </p>
                <p>
                  From our carefully curated fabrics to our ethically managed supply chain, we ensure
                  that when you wear Luxe Wear, you're not just wearing fashion—you're wearing values.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
                  alt="Fashion atelier"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/10 rounded-lg -z-10" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-stone-200 rounded-lg -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-stone-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <AnimatedStatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32 bg-stone-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="text-4xl lg:text-5xl font-heading font-light mt-4 mb-6">
              What We Stand For
            </h2>
            <p className="text-muted-foreground">
              Our values guide every decision we make, from design to delivery.
              They're not just words—they're commitments we live by every day.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
                    alt="Team member"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
                    alt="Team member"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400"
                    alt="Team member"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                    alt="Team member"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Our Team
              </span>
              <h2 className="text-4xl lg:text-5xl font-heading font-light mt-4 mb-6">
                Meet the Creators
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Behind every Luxe Wear piece is a team of dedicated professionals who
                  share a passion for fashion, sustainability, and exceptional quality.
                </p>
                <p>
                  From our designers who sketch the initial concepts to our artisans who
                  bring them to life, every team member plays a crucial role in delivering
                  the luxury experience our customers deserve.
                </p>
                <p>
                  Together, we're not just building a brand—we're building a movement
                  towards more conscious and beautiful fashion.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-light mb-6">
              Ready to Experience Luxe Wear?
            </h2>
            <p className="text-stone-400 mb-8">
              Discover our collection and find pieces that reflect your style and values.
            </p>
            <a
              href="/shop"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Shop Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
