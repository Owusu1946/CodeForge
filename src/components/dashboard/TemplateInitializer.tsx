'use client'

import { useState } from 'react'
import { Terminal } from './Terminal'
import { templateService } from '@/lib/services/templateService'
import { useFileTree } from '@/contexts/FileTreeContext'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function TemplateInitializer() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isCreatingFiles, setIsCreatingFiles] = useState(false)
  const [commands, setCommands] = useState<string[]>([])
  const { user } = useAuth()
  const { loadFiles } = useFileTree()

  const initializeReactTemplate = async () => {
    if (!user) return
    setIsInitializing(true)
    setIsCreatingFiles(true)

    try {
      const template = await templateService.initializeTemplate(user.id, 'react')
      setIsCreatingFiles(false)
      setCommands(template.commands)
    } catch (error) {
      console.error('Error initializing template:', error)
      setIsInitializing(false)
      setIsCreatingFiles(false)
    }
  }

  const handleCommandsComplete = async () => {
    await loadFiles()
    setIsInitializing(false)
  }

  return (
    <div className="space-y-4">
      {!isInitializing ? (
        <Button onClick={initializeReactTemplate}>
          Initialize React Template
        </Button>
      ) : (
        <div className="space-y-4">
          {isCreatingFiles ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating project files...
            </div>
          ) : (
            <Terminal 
              commands={commands} 
              onCommandComplete={handleCommandsComplete} 
            />
          )}
        </div>
      )}
    </div>
  )
} 