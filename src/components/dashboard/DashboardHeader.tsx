'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  File, Edit, Menu, Eye, Play, 
  MoreHorizontal, ChevronLeft, ChevronRight, 
  Search, Layout, Bell, X, MessageSquare,
  Users, Share2, UserPlus, FolderOpen, Save,
  SaveAll, FileText, Settings, LogOut, Loader2,
  Terminal
} from 'lucide-react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useFileTree } from '@/contexts/FileTreeContext'
import { CollaboratorMenu } from './CollaboratorMenu'

interface DashboardHeaderProps {
  onToggleTerminal: () => void
}

export function DashboardHeader({ onToggleTerminal }: DashboardHeaderProps) {
  const { user, logout } = useAuth() // Changed from signOut to logout
  const { createFile, saveFile, files, currentFile } = useFileTree()
  const [chatOpen, setChatOpen] = useState(false)
  const [showCollabMenu, setShowCollabMenu] = useState(false)
  const [showFileMenu, setShowFileMenu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ total: 0, current: 0 })
  

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.menu-container')) {
        setShowFileMenu(false)
        setShowCollabMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)
    setUploadProgress({ total: files.length, current: 0 })
    console.log(`Starting upload of ${files.length} files...`)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()

        await new Promise((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              const content = e.target?.result as string
              console.log(`Processing file: ${file.name}`)
              await createFile(file.name, 'file', undefined, content)
              setUploadProgress(prev => ({ ...prev, current: prev.current + 1 }))
              resolve(null)
            } catch (error) {
              console.error(`Error processing file ${file.name}:`, error)
              reject(error)
            }
          }
          reader.onerror = () => reject(reader.error)
          reader.readAsText(file)
        })
      }
    } catch (error) {
      console.error('File upload failed:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress({ total: 0, current: 0 })
    }
  }

  const handleFolderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)
    setUploadProgress({ total: files.length, current: 0 })
    console.log(`Starting folder upload with ${files.length} files...`)

    try {
      const folderStructure = new Map<string, string>()
      const folderPromises: Promise<string>[] = []

      // First, create all folders
      for (let i = 0; i < files.length; i++) {
        const file = files[i] as any
        const relativePath = file.webkitRelativePath
        const pathParts = relativePath.split('/')
        
        let currentPath = ''
        for (let j = 0; j < pathParts.length - 1; j++) {
          const folderName = pathParts[j]
          const parentPath = currentPath
          currentPath = currentPath ? `${currentPath}/${folderName}` : folderName

          if (!folderStructure.has(currentPath)) {
            console.log(`Creating folder: ${folderName}`)
            const parentId = folderStructure.get(parentPath)
            const promise = createFile(folderName, 'folder', parentId)
            folderPromises.push(
              promise.then(folderId => {
                folderStructure.set(currentPath, folderId)
                return folderId
              })
            )
          }
        }
      }

      // Wait for all folders to be created
      await Promise.all(folderPromises)

      // Then create all files
      for (let i = 0; i < files.length; i++) {
        const file = files[i] as any
        const relativePath = file.webkitRelativePath
        const pathParts = relativePath.split('/')
        const fileName = pathParts[pathParts.length - 1]
        const parentPath = pathParts.slice(0, -1).join('/')
        const parentId = folderStructure.get(parentPath)

        console.log(`Processing file: ${relativePath}`)
        const reader = new FileReader()

        await new Promise((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              const content = e.target?.result as string
              await createFile(fileName, 'file', parentId, content)
              setUploadProgress(prev => ({ ...prev, current: prev.current + 1 }))
              resolve(null)
            } catch (error) {
              console.error(`Error processing file ${relativePath}:`, error)
              reject(error)
            }
          }
          reader.onerror = () => reject(reader.error)
          reader.readAsText(file)
        })
      }
    } catch (error) {
      console.error('Folder upload failed:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress({ total: 0, current: 0 })
    }
  }

  return (
    <header className="h-[38px] bg-[#3c3c3c] border-b border-[#2d2d2d] flex items-center px-2 fixed top-0 left-0 right-0 z-50 text-[#cccccc] text-sm">
      <div className="flex items-center">
        <div 
          className="menu-container relative flex items-center h-[38px] px-2 hover:bg-[#505050] cursor-pointer"
          onClick={() => setShowFileMenu(!showFileMenu)}
        >
          <File className="w-4 h-4 mr-2" />
          File
          
          {showFileMenu && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-[#252526] rounded-sm shadow-lg border border-[#2d2d2d] py-1">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                multiple
              />
              <input
                type="file"
                ref={folderInputRef}
                className="hidden"
                onChange={handleFolderUpload}
                {...{ webkitdirectory: "", directory: "" } as any}
              />
              
              <button 
                className="w-full text-left px-3 py-1.5 hover:bg-[#2d2d2d] flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="w-4 h-4" />
                <div className="flex-1">Open File</div>
                <span className="text-xs opacity-50">Ctrl+O</span>
              </button>
              
              <button 
                className="w-full text-left px-3 py-1.5 hover:bg-[#2d2d2d] flex items-center gap-2"
                onClick={() => folderInputRef.current?.click()}
              >
                <FolderOpen className="w-4 h-4" />
                <div className="flex-1">Open Folder</div>
                <span className="text-xs opacity-50">Ctrl+K</span>
              </button>
              
              <div className="my-1 border-b border-[#2d2d2d]" />
              
              <button 
                className="w-full text-left px-3 py-1.5 hover:bg-[#2d2d2d] flex items-center gap-2"
                onClick={() => currentFile && saveFile(currentFile)}
              >
                <Save className="w-4 h-4" />
                <div className="flex-1">Save</div>
                <span className="text-xs opacity-50">Ctrl+S</span>
              </button>
              
              <button 
                className="w-full text-left px-3 py-1.5 hover:bg-[#2d2d2d] flex items-center gap-2"
                onClick={() => files.forEach(file => saveFile(file))}
              >
                <SaveAll className="w-4 h-4" />
                <div className="flex-1">Save All</div>
                <span className="text-xs opacity-50">Ctrl+K S</span>
              </button>
              
              <div className="my-1 border-b border-[#2d2d2d]" />
              
              <button 
                className="w-full text-left px-3 py-1.5 hover:bg-[#2d2d2d] flex items-center gap-2"
                onClick={() => {/* Add preferences handler */}}
              >
                <Settings className="w-4 h-4" />
                <div className="flex-1">Preferences</div>
                <span className="text-xs opacity-50">Ctrl+,</span>
              </button>
              
              <div className="my-1 border-b border-[#2d2d2d]" />
              
              <button 
                className="w-full text-left px-3 py-1.5 hover:bg-[#2d2d2d] flex items-center gap-2 text-red-400"
                onClick={logout}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center h-[38px] px-2 hover:bg-[#505050] cursor-pointer">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </div>
        <div className="flex items-center h-[38px] px-2 hover:bg-[#505050] cursor-pointer">
          <Menu className="w-4 h-4 mr-2" />
          Selection
        </div>
        <div className="flex items-center h-[38px] px-2 hover:bg-[#505050] cursor-pointer">
          <Eye className="w-4 h-4 mr-2" />
          View
        </div>
        <div className="flex items-center h-[38px] px-2 hover:bg-[#505050] cursor-pointer">
          <Play className="w-4 h-4 mr-2" />
          Run
        </div>
        <div className="flex items-center h-[38px] px-2 hover:bg-[#505050] cursor-pointer">
          <MoreHorizontal className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-center mx-2">
        <button className="p-1 hover:bg-[#505050] rounded-sm">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-[#505050] rounded-sm">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex items-center mx-2">
        <div className="flex items-center bg-[#252526] rounded-sm px-2 py-1 w-[300px]">
          <Search className="w-4 h-4 mr-2 text-[#858585]" />
          <input 
            type="text"
            placeholder="codeforge"
            className="bg-transparent border-none outline-none text-sm w-full placeholder-[#858585]"
          />
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative">
          <button 
            className="p-1.5 hover:bg-[#505050] rounded-sm flex items-center gap-2"
            onClick={() => setShowCollabMenu(!showCollabMenu)}
          >
            <Users className="w-4 h-4" />
            <span className="text-xs bg-blue-500 rounded-full px-1">3</span>
          </button>

          {showCollabMenu && (
            <CollaboratorMenu />
          )}
        </div>

        <button 
          className="p-1.5 hover:bg-[#505050] rounded-sm"
          onClick={() => setChatOpen(!chatOpen)}
        >
          <MessageSquare className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-[#505050] rounded-sm">
          <Layout className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-[#505050] rounded-sm">
          <Bell className="w-4 h-4" />
        </button>
        <button 
          className="p-1.5 hover:bg-[#505050] rounded-sm"
          onClick={onToggleTerminal}
          title="Toggle Terminal"
        >
          <Terminal className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-[#505050] rounded-sm">
          <Layout className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-[#505050] rounded-sm ml-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {isUploading && (
        <div className="absolute top-full left-0 right-0 bg-[#252526] border-b border-[#2d2d2d] p-2">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>
              Uploading... {uploadProgress.current}/{uploadProgress.total}
            </span>
          </div>
          <div className="h-1 bg-[#3c3c3c] mt-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ 
                width: `${(uploadProgress.current / uploadProgress.total) * 100}%` 
              }}
            />
          </div>
        </div>
      )}
    </header>
  )
} 