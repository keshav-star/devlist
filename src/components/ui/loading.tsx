import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  variant?: 'spinner' | 'dots' | 'pulse'
  className?: string
}

export function Loading({ 
  size = 'md', 
  text, 
  variant = 'spinner',
  className = '' 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ${sizeClasses[size]}`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        {text && (
          <span className={`text-gray-600 ${textSizes[size]}`}>
            {text}
          </span>
        )}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center gap-3 ${className}`}>
        <motion.div
          className={`bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ${sizeClasses[size]}`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {text && (
          <span className={`text-gray-600 ${textSizes[size]}`}>
            {text}
          </span>
        )}
      </div>
    )
  }

  // Default spinner
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Loader2 className={`${sizeClasses[size]} text-blue-500`} />
      </motion.div>
      {text && (
        <span className={`text-gray-600 ${textSizes[size]}`}>
          {text}
        </span>
      )}
    </div>
  )
}

// Skeleton loading component
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  )
}

// Button loading state
export function ButtonLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Loading size="sm" variant="spinner" />
      <span>{text}</span>
    </div>
  )
} 