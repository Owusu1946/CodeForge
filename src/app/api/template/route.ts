import { exec } from 'child_process'
import { mkdir, writeFile } from 'fs/promises'
import { promisify } from 'util'
import path from 'path'
import { NextResponse } from 'next/server'

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    const { userId, templateType } = await request.json()
    
    // Create workspace directory for user
    const workspacePath = path.join(process.cwd(), 'workspaces', userId)
    await mkdir(workspacePath, { recursive: true })
    
    // Initialize template files
    const files = [
      {
        path: 'src/main.tsx',
        content: `import React from 'react'...`  // Reference templateService.ts lines 30-39
      },
      // Add other files similarly
    ]

    for (const file of files) {
      const filePath = path.join(workspacePath, file.path)
      const dirPath = path.dirname(filePath)
      await mkdir(dirPath, { recursive: true })
      await writeFile(filePath, file.content)
    }

    // Execute commands in workspace directory
    const commands = [
      'npm create vite@latest . -- --template react-ts',
      'npm install',
      'npm run dev'
    ]

    for (const command of commands) {
      const { stdout, stderr } = await execAsync(command, { cwd: workspacePath })
      console.log(stdout)
      if (stderr) console.error(stderr)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Template initialization failed:', error)
    return NextResponse.json({ error: 'Template initialization failed' }, { status: 500 })
  }
} 