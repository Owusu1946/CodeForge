'use client'

import { useEffect, useRef } from 'react'
import { Editor as MonacoEditor } from '@monaco-editor/react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import { useFileTree } from '@/contexts/FileTreeContext'
import { debounce } from 'lodash'
import { TemplateInitializer } from './TemplateInitializer'

export function Editor() {
  const { currentFile, saveFile, files } = useFileTree()
  const editorRef = useRef<any>(null)

  const debouncedSave = debounce((content: string) => {
    if (currentFile) {
      saveFile({ ...currentFile, content })
    }
  }, 1000)

  useEffect(() => {
    if (!editorRef.current || !currentFile) return

    const doc = new Y.Doc()
    const provider = new WebsocketProvider(
      'ws://localhost:1234',
      `file-${currentFile.id}`,
      doc
    )
    
    const type = doc.getText('monaco')
    type.delete(0, type.length)
    type.insert(0, currentFile.content || '')

    const binding = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    )

    return () => {
      binding.destroy()
      doc.destroy()
      provider.destroy()
    }
  }, [currentFile])

  // Show template initializer when no files exist
  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <TemplateInitializer />
      </div>
    )
  }

  // Show file selection prompt when no file is selected
  if (!currentFile) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a file to edit
      </div>
    )
  }

  return (
    <MonacoEditor
      height="100%"
      defaultLanguage="typescript"
      value={currentFile.content}
      theme="vs-dark"
      onMount={(editor) => {
        editorRef.current = editor
      }}
      onChange={(value) => {
        if (value) {
          debouncedSave(value)
        }
      }}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  )
} 