'use client'

import { Plus, Search } from 'lucide-react'
import { FileTreeItem } from './FileTreeItem'
import { FileTreeSkeleton } from './FileTreeSkeleton'
import { useFileTree } from '@/contexts/FileTreeContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function FileTree() {
  const { files, isLoading, createFile } = useFileTree()
  const [showNewFileMenu, setShowNewFileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full text-[#cccccc]">
      <div className="p-2">
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-7 bg-[#3c3c3c] border-none text-sm"
          prefix={<Search className="w-4 h-4 text-[#cccccc]" />}
        />
      </div>

      <div className="flex-1 overflow-auto py-2">
        {isLoading ? (
          <FileTreeSkeleton />
        ) : (
          filteredFiles.map(file => (
            <FileTreeItem key={file.id} node={file} />
          ))
        )}
      </div>

      {showNewFileMenu && (
        <div className="absolute top-[38px] right-2 w-48 bg-[#252526] rounded-sm shadow-lg border border-[#2d2d2d] py-1 z-10">
          <button
            className="w-full text-left px-3 py-1 text-sm hover:bg-[#2d2d2d] flex items-center gap-2"
            onClick={() => {
              createFile('New File', 'file')
              setShowNewFileMenu(false)
            }}
          >
            New File
          </button>
          <button
            className="w-full text-left px-3 py-1 text-sm hover:bg-[#2d2d2d] flex items-center gap-2"
            onClick={() => {
              createFile('New Folder', 'folder')
              setShowNewFileMenu(false)
            }}
          >
            New Folder
          </button>
        </div>
      )}
    </div>
  )
} 