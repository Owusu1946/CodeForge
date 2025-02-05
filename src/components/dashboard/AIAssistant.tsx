'use client'

import { useState } from 'react'
import { Send, X, MessageSquare, Bot, User, Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return

    const newMessage = { role: 'user' as const, content: prompt }
    setMessages(prev => [...prev, newMessage])
    setPrompt('')
    setIsLoading(true)

    try {
      const response = { role: 'assistant' as const, content: 'AI response placeholder' }
      setMessages(prev => [...prev, response])
    } catch (error) {
      console.error('Error getting AI response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  

  if (!isOpen) return null

  return (
    <div className="w-[400px] h-full flex flex-col bg-[#1e1e1e] border-l border-[#2d2d2d]">
      <div className="h-[38px] flex items-center justify-between px-3 border-b border-[#2d2d2d] bg-[#252526]">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#cccccc]" />
          <span className="text-sm text-[#cccccc]">Chat</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-[#505050] rounded-sm transition-colors"
        >
          <X className="w-4 h-4 text-[#cccccc]" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-2 text-sm text-[#cccccc]",
              message.role === 'user' ? "flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center",
              message.role === 'user' ? "bg-blue-500" : "bg-[#2d2d2d]"
            )}>
              {message.role === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div className={cn(
              "p-3 rounded-lg max-w-[85%]",
              message.role === 'user' ? "bg-blue-500/10" : "bg-[#2d2d2d]"
            )}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-[#cccccc]">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm">AI is thinking...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-[#2d2d2d]">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI for help..."
            className="flex-1 px-3 py-1.5 bg-[#2d2d2d] text-[#cccccc] text-sm rounded-sm border-none outline-none placeholder-[#808080]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-1.5 rounded-sm bg-[#2d2d2d] text-[#cccccc] hover:bg-[#505050] disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
} 