'use client'

import { useState } from 'react'
import { 
  File, Folder, ChevronRight, Trash2, Edit2, Plus,
  FileCode, FileText, FileJson, Coffee, FileHtml
} from 'lucide-react'
import { FileNode } from '@/types/file'
import { Button } from '@/components/ui/button'
import { useFileTree } from '@/contexts/FileTreeContext'
import { cn } from '@/lib/utils'

const FILE_ICONS: Record<string, any> = {
  '.tsx': FileCode,
  '.ts': Coffee,
  '.js': Coffee,
  '.jsx': FileCode,
  '.json': FileJson,
  '.html': FileHtml,
  '.txt': FileText,
  '.css': FileText,
  '.md': FileText,
  '.vue': Coffee,
  '.py': Coffee,
  '.php': Coffee,
  '.rb': Coffee,
  '.java': Coffee,
  '.go': Coffee,
  '.rs': Coffee,
  '.c': Coffee,
  '.cpp': Coffee,
  '.h': Coffee,
  '.hpp': Coffee,
  '.cs': Coffee,
  '.swift': Coffee,
  '.kt': Coffee,
  '.dart': Coffee,
  '.yaml': FileText,
  '.yml': FileText,
  '.toml': FileText,
  '.ini': FileText,
  '.env': FileText,
  '.gitignore': FileText,
  '.dockerignore': FileText,
  '.eslintrc': FileJson,
  '.prettierrc': FileJson,
  '.babelrc': FileJson,
  'package.json': FileJson,
  'tsconfig.json': FileJson,
  'default': File
}

function getFileIcon(fileName: string) {
  // First check for exact file name matches
  if (FILE_ICONS[fileName]) {
    return FILE_ICONS[fileName]
  }

  // Then check file extensions
  const extension = '.' + fileName.split('.').pop()
  return FILE_ICONS[extension] || FILE_ICONS['default']
}

interface FileTreeItemProps {
  node: FileNode
  level?: number
}

export function FileTreeItem({ node, level = 0 }: FileTreeItemProps) {
  const { setCurrentFile, deleteFile, renameFile, createFile, moveFile } = useFileTree()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(node.name)
  const [showNewFileMenu, setShowNewFileMenu] = useState(false)

  const handleCreateFile = (type: 'file' | 'folder') => {
    const baseName = type === 'file' ? 'New File' : 'New Folder'
    createFile(baseName, type, node.id)
    setIsExpanded(true)
    setShowNewFileMenu(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded)
    } else {
      setCurrentFile(node)
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()
    e.dataTransfer.setData('fileId', node.id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (node.type === 'folder') {
      e.currentTarget.classList.add('bg-[#2d2d2d]')
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('bg-[#2d2d2d]')
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('bg-[#2d2d2d]')

    const fileId = e.dataTransfer.getData('fileId')
    if (fileId && node.type === 'folder' && fileId !== node.id) {
      await moveFile(fileId, node.id)
    }
  }

  const FileIcon = node.type === 'folder' ? Folder : getFileIcon(node.name)

  return (
    <div className="select-none">
      <div
        draggable
        onClick={handleClick}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex items-center gap-1 px-2 py-1 hover:bg-[#2d2d2d] cursor-pointer group transition-colors",
          "border-l-2 border-transparent hover:border-[#2d2d2d]"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <div className="flex items-center gap-2">
          {node.type === 'folder' && (
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-transform",
                isExpanded && "transform rotate-90"
              )}
            />
          )}
          <FileIcon className="w-4 h-4" />
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={() => {
                renameFile(node.id, editName)
                setIsEditing(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  renameFile(node.id, editName)
                  setIsEditing(false)
                }
              }}
              className="bg-[#3c3c3c] px-1 outline-none"
              autoFocus
            />
          ) : (
            <span>{node.name}</span>
          )}
        </div>

        <div className="hidden group-hover:flex items-center gap-1">
          <Button
            variant="ghost"
            className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
          >
            <Edit2 className="w-3 h-3" />
          </Button>
          
          {node.type === 'folder' && (
            <Button
              variant="ghost"
              className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                setShowNewFileMenu(!showNewFileMenu)
              }}
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            className="h-6 w-6 p-0 opacity-60 hover:opacity-100 text-red-600"
            onClick={(e) => {
              e.stopPropagation()
              deleteFile(node.id)
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {showNewFileMenu && (
        <div className="absolute ml-4 w-48 bg-[#252526] rounded-sm shadow-lg border border-[#2d2d2d] py-1 z-10">
          <button
            className="w-full text-left px-3 py-1 text-sm hover:bg-[#2d2d2d] flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation()
              handleCreateFile('file')
            }}
          >
            <FileText className="w-4 h-4" />
            New File
          </button>
          <button
            className="w-full text-left px-3 py-1 text-sm hover:bg-[#2d2d2d] flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation()
              handleCreateFile('folder')
            }}
          >
            <Folder className="w-4 h-4" />
            New Folder
          </button>
        </div>
      )}

      {isExpanded && node.children?.map((child) => (
        <FileTreeItem key={child.id} node={child} level={level + 1} />
      ))}
    </div>
  )
} 