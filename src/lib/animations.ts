import type { Variants } from 'framer-motion'

/**
 * Animation Variants Library
 * Medium intensity animations for luxury e-commerce experience
 */

// Page Load & Container Animations
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

// Fade Animations
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const fadeInDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// Scale Animations
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export const scaleUpVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// Product Card Animations
export const productCardVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
}

export const productImageVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

// Button Animations
export const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
}

export const iconButtonVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.9,
    rotate: 5,
    transition: { duration: 0.1 },
  },
}

// Slide Animations
export const slideInLeftVariants: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    x: -100,
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
}

export const slideInRightVariants: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    x: 100,
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
}

// Modal & Drawer Animations
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

export const drawerVariants: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.3, ease: 'easeIn' },
  },
}

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

// List Item Animations
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

// Badge & Tag Animations
export const badgeVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut', delay: 0.1 },
  },
}

// Page Transition Animations
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
}

// Hero Section Animations
export const heroTextVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
  },
}

export const heroCTAVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.6 },
  },
}

// Input & Form Animations
export const inputFocusVariants: Variants = {
  rest: { scale: 1 },
  focus: {
    scale: 1.01,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
}

export const errorShakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
}

// Notification & Toast Animations
export const toastVariants: Variants = {
  hidden: { opacity: 0, y: -50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

// Skeleton Loading Animations
export const skeletonVariants: Variants = {
  pulse: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Counter Animations (for cart totals, etc.)
export const counterVariants: Variants = {
  initial: { scale: 1 },
  update: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.3 },
  },
}

// Accordion Animations
export const accordionVariants: Variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

// Image Crossfade for Product Cards
export const imageCrossfadeVariants: Variants = {
  primary: { opacity: 1, zIndex: 1 },
  secondary: { opacity: 0, zIndex: 0 },
  hover: {
    primary: { opacity: 0, zIndex: 0 },
    secondary: { opacity: 1, zIndex: 1 },
  },
}

/**
 * Utility function to create custom stagger delay
 */
export const createStaggerVariants = (
  staggerDelay: number = 0.1,
  childDelay: number = 0
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: childDelay,
    },
  },
})

/**
 * Utility function to create custom fade-in-up with delay
 */
export const createFadeInUpVariants = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay },
  },
})
