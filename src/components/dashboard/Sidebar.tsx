'use client'

import { 
  ChevronLeft, ChevronRight, Puzzle, Users, Share2, 
  UserPlus, Settings, User, FolderPlus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFileTree } from '@/contexts/FileTreeContext'
import { useState } from 'react'

interface SidebarProps {
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ children, isOpen, onToggle }: SidebarProps) {
  const { createFile } = useFileTree()
  const [showNewFileMenu, setShowNewFileMenu] = useState(false)

  return (
    <>
      <div 
        className={cn(
          "border-r border-[#2d2d2d] transition-all duration-300 flex",
          isOpen ? "w-64" : "w-0"
        )}
      >
        <div className="h-full flex flex-col bg-[#252526] min-w-[256px]">
          <div className="p-4 border-b border-[#2d2d2d] flex items-center justify-between">
            <h2 className="font-semibold text-[#cccccc]">Files</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => createFile('New Folder', 'folder')}
                className="p-1 hover:bg-[#2d2d2d] rounded-sm transition-colors"
              >
                <FolderPlus className="w-4 h-4 text-[#cccccc]" />
              </button>
            </div>
          </div>

          {/* Collaboration status */}
          <div className="px-4 py-2 border-b border-[#2d2d2d] bg-[#2d2d2d]/50">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs border-2 border-[#252526]">
                  JD
                </div>
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs border-2 border-[#252526]">
                  JS
                </div>
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs border-2 border-[#252526]">
                  +1
                </div>
              </div>
              <span className="text-xs text-[#cccccc]">3 collaborators</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Collapse/Expand Button */}
      <button
        onClick={onToggle}
        className={cn(
          "h-8 w-4 flex items-center justify-center",
          "absolute top-[50%] transform -translate-y-1/2 z-10",
          "bg-[#2d2d2d] text-[#cccccc]",
          "hover:bg-[#505050] transition-all duration-300",
          "border-y border-r border-[#2d2d2d] rounded-r",
          isOpen ? "left-64" : "left-0"
        )}
      >
        {isOpen ? (
          <ChevronLeft className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
      </button>
    </>
  )
} 