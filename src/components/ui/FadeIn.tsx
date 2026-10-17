'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
  priority?: boolean
}

export function FadeIn({ children, delay = 0, direction = 'up', className = '', priority = false }: FadeInProps) {
  if (priority) {
    return (
      <div className={className}>
        {children}
      </div>
    )
  }

  const directionOffset = {
    up: 30,
    down: -30,
    left: 30,
    right: -30,
  }

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: direction === 'up' || direction === 'down' ? directionOffset[direction] : 0,
        x: direction === 'left' || direction === 'right' ? directionOffset[direction] : 0
      }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
