'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { FileNode } from '@/types/file'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface FileTreeContextType {
  files: FileNode[]
  currentFile: FileNode | null
  isLoading: boolean
  setFiles: (files: FileNode[]) => void
  setCurrentFile: (file: FileNode | null) => void
  saveFile: (file: FileNode) => Promise<void>
  deleteFile: (fileId: string) => Promise<void>
  createFile: (name: string, type: 'file' | 'folder', parentId?: string, content?: string) => Promise<string>
  renameFile: (id: string, newName: string) => void
  moveFile: (fileId: string, newParentId: string | null) => Promise<void>
}

const FileTreeContext = createContext<FileTreeContextType | undefined>(undefined)

export function FileTreeProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FileNode[]>([])
  const [currentFile, setCurrentFile] = useState<FileNode | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadFiles()
    }
  }, [user])

  const loadFiles = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setFiles(buildFileTree(data || []))
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setIsLoading(false)
    }
  }

 

  const buildFileTree = (flatFiles: any[]): FileNode[] => {
    const fileMap = new Map()
    const roots: FileNode[] = []

    flatFiles.forEach(file => {
      fileMap.set(file.id, {
        id: file.id,
        name: file.name,
        type: file.type,
        content: file.content,
        parentId: file.parent_id,
        children: []
      })
    })

    flatFiles.forEach(file => {
      const node = fileMap.get(file.id)
      if (file.parent_id) {
        const parent = fileMap.get(file.parent_id)
        if (parent) {
          parent.children.push(node)
        }
      } else {
        roots.push(node)
      }
    })

    return roots
  }

  const moveFile = async (fileId: string, newParentId: string | null) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from('files')
        .update({ parent_id: newParentId })
        .eq('id', fileId)

      if (error) throw error
      await loadFiles()
    } catch (error) {
      console.error('Error moving file:', error)
    }
  }

  const saveFile = async (file: FileNode) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from('files')
        .upsert({
          id: file.id,
          name: file.name,
          type: file.type,
          content: file.content,
          user_id: user.id,
          parent_id: file.parentId,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      await loadFiles()
    } catch (error) {
      console.error('Error saving file:', error)
    }
  }

  const deleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)

      if (error) throw error
      if (currentFile?.id === fileId) {
        setCurrentFile(null)
      }
      await loadFiles()
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  const createFile = async (name: string, type: 'file' | 'folder', parentId?: string, content?: string): Promise<string> => {
    if (!user) return ''
    try {
      console.log(`Creating ${type}: ${name}${parentId ? ` under parent ${parentId}` : ''}`)
      const fileId = crypto.randomUUID()
      const newFile = {
        id: fileId,
        name,
        type,
        content: content || (type === 'file' ? '// Welcome CodeForger.. Write your code here. ' : undefined),
        user_id: user.id,
        parent_id: parentId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('files')
        .insert(newFile)

      if (error) {
        console.error(`Error creating ${type}:`, error)
        throw error
      }

      console.log(`Successfully created ${type}: ${name} with ID ${fileId}`)
      await loadFiles()
      return fileId
    } catch (error) {
      console.error(`Failed to create ${type} ${name}:`, error)
      throw error
    }
  }

  const renameFile = async (id: string, newName: string) => {
    if (!user) return
  
    try {
      // Update in database first
      const { error } = await supabase
        .from('files')
        .update({ name: newName })
        .eq('id', id)
  
      if (error) throw error
  
      // Then update in local state
      const updateFileNameInTree = (files: FileNode[]): FileNode[] => {
        return files.map(file => {
          if (file.id === id) {
            return { ...file, name: newName }
          }
          if (file.children && file.children.length > 0) {
            return {
              ...file,
              children: updateFileNameInTree(file.children)
            }
          }
          return file
        })
      }
  
      setFiles(prevFiles => updateFileNameInTree(prevFiles))
    } catch (error) {
      console.error('Error renaming file:', error)
    }
  }

  const value = {
    files,
    currentFile,
    isLoading,
    setFiles,
    setCurrentFile,
    saveFile,
    deleteFile,
    createFile,
    renameFile,
    moveFile
  }

  return (
    <FileTreeContext.Provider value={value}>
      {children}
    </FileTreeContext.Provider>
  )
}

export const useFileTree = () => {
  const context = useContext(FileTreeContext)
  if (!context) {
    throw new Error('useFileTree must be used within a FileTreeProvider')
  }
  return context
} 