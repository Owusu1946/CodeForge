'use client'

import { useEffect, useRef, useState } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import 'xterm/css/xterm.css'

interface TerminalProps {
  commands?: string[]
  onCommandComplete?: () => void
}

export function Terminal({ commands = [], onCommandComplete }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const [terminal, setTerminal] = useState<XTerm>()
  const [currentCommand, setCurrentCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  useEffect(() => {
    if (!terminalRef.current) return

    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff'
      },
      rows: 10
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.loadAddon(new WebLinksAddon())

    term.open(terminalRef.current)
    fitAddon.fit()
    
    // Write initial prompt
    term.write('\r\n$ ')

    // Handle user input
    term.onKey(({ key, domEvent }) => {
      const ev = domEvent as KeyboardEvent
      
      if (ev.key === 'Enter') {
        // Execute command
        executeCommand(currentCommand)
        setCurrentCommand('')
        setHistoryIndex(-1)
      } else if (ev.key === 'Backspace') {
        if (currentCommand.length > 0) {
          term.write('\b \b')
          setCurrentCommand(prev => prev.slice(0, -1))
        }
      } else if (ev.key === 'ArrowUp') {
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1
          const command = commandHistory[commandHistory.length - 1 - newIndex]
          setHistoryIndex(newIndex)
          // Clear current line and write new command
          term.write('\x1b[2K\r$ ' + command)
          setCurrentCommand(command)
        }
      } else if (ev.key === 'ArrowDown') {
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          const command = commandHistory[commandHistory.length - 1 - newIndex]
          setHistoryIndex(newIndex)
          // Clear current line and write new command
          term.write('\x1b[2K\r$ ' + command)
          setCurrentCommand(command)
        } else {
          setHistoryIndex(-1)
          term.write('\x1b[2K\r$ ')
          setCurrentCommand('')
        }
      } else if (!ev.ctrlKey && !ev.altKey) {
        term.write(key)
        setCurrentCommand(prev => prev + key)
      }
    })

    setTerminal(term)

    return () => {
      term.dispose()
    }
  }, [])

  const executeCommand = async (command: string) => {
    if (!terminal) return
    
    terminal.writeln('')
    setCommandHistory(prev => [...prev, command])

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      })

      if (!response.ok) {
        throw new Error('Command execution failed')
      }

      const reader = response.body?.getReader()
      if (!reader) return

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const text = new TextDecoder().decode(value)
        terminal.write(text)
      }
    } catch (error) {
      terminal.writeln(`\r\nError: ${error}`)
    } finally {
      terminal.write('\r\n$ ')
    }
  }

  return (
    <div ref={terminalRef} className="h-full bg-[#1e1e1e] rounded-md overflow-hidden" />
  )
} 