'use client'

import { FileTree } from '@/components/dashboard/FileTree'
import { Editor } from '@/components/dashboard/Editor'
import { AIAssistant } from '@/components/dashboard/AIAssistant'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Terminal } from '@/components/dashboard/Terminal'
import { FileTreeProvider } from '@/contexts/FileTreeContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { useState } from 'react'
import { CollaborationProvider } from '@/contexts/CollaborationContext'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(true)
  const [showTerminal, setShowTerminal] = useState(false)

  return (
    <ThemeProvider>
      <FileTreeProvider>
        <CollaborationProvider>
          <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
            <DashboardHeader onToggleTerminal={() => setShowTerminal(!showTerminal)} />
            
            <div className="flex-1 flex overflow-hidden pt-[38px] relative">
              <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)}>
                <FileTree />
              </Sidebar>

              <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 flex">
                  <div className="flex-1 overflow-hidden">
                    <Editor />
                  </div>
                  <AIAssistant isOpen={chatOpen} onClose={() => setChatOpen(false)} />
                </div>
                {showTerminal && (
                  <div className="h-64 border-t border-[#2d2d2d]">
                    <Terminal commands={[]} onCommandComplete={() => {}} />
                  </div>
                )}
              </main>
            </div>
          </div>
        </CollaborationProvider>
      </FileTreeProvider>
    </ThemeProvider>
  )
}