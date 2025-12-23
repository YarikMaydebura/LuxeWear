import { Link } from 'react-router-dom'
import { Instagram, Facebook, Dribbble } from 'lucide-react'
import { CONTACT_INFO, SOCIAL_LINKS } from '@/lib/constants'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        {/* Newsletter Section */}
        <div className="max-w-md mx-auto text-center mb-12 lg:mb-16">
          <h3 className="text-2xl font-heading font-light mb-2">
            Subscribe to our newsletter
          </h3>
          <p className="text-sm text-secondary-foreground/70 mb-6">
            Be the first to know about new arrivals and exclusive offers
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Shop */}
          <div>
            <h4 className="font-heading text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop/women" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/shop/men" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/shop/accessories" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop/sale" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-heading text-lg mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-heading text-lg mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li>{CONTACT_INFO.email}</li>
              <li>{CONTACT_INFO.phone}</li>
              <li className="pt-2">
                <p>{CONTACT_INFO.address.street}</p>
                <p>{CONTACT_INFO.address.city}, {CONTACT_INFO.address.state} {CONTACT_INFO.address.zip}</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-secondary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-secondary-foreground/70">
              © {currentYear} Luxe Wear. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
                aria-label="Pinterest"
              >
                <Dribbble className="w-5 h-5" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-4 text-sm text-secondary-foreground/70">
              <a href="#" className="hover:text-secondary-foreground transition-colors">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-secondary-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
