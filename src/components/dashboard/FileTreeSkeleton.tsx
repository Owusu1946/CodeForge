'use client'

import { Skeleton } from '@/components/ui/Skeleton'

export function FileTreeItemSkeleton({ level = 0 }: { level?: number }) {
  return (
    <div 
      className="flex items-center gap-2 px-2 py-1"
      style={{ paddingLeft: `${level * 12 + 8}px` }}
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[100px]" />
    </div>
  )
}

export function FileTreeSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i}>
          <FileTreeItemSkeleton />
          {i % 2 === 0 && (
            <>
              <FileTreeItemSkeleton level={1} />
              <FileTreeItemSkeleton level={1} />
              {i === 0 && <FileTreeItemSkeleton level={2} />}
            </>
          )}
        </div>
      ))}
    </div>
  )
} 