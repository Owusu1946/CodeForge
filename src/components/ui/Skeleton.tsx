'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-transparent via-[#3c3c3c] to-transparent",
        "bg-[length:400%_100%] rounded-sm",
        className
      )}
    />
  )
} 