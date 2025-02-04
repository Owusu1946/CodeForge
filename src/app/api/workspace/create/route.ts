import { NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { REACT_TEMPLATE } from '@/lib/templates/react'

export async function POST(request: Request) {
  try {
    const { userId, templateType } = await request.json()
    const workspacePath = path.join(process.cwd(), 'workspaces', userId)
    
    // Create workspace directory
    await mkdir(workspacePath, { recursive: true })
    
    // Write template files
    const template = templateType === 'react' ? REACT_TEMPLATE : null
    if (!template) throw new Error('Template not found')

    for (const file of template.files) {
      const filePath = path.join(workspacePath, file.path)
      await mkdir(path.dirname(filePath), { recursive: true })
      await writeFile(filePath, file.content)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Workspace creation failed:', error)
    return NextResponse.json({ error: 'Workspace creation failed' }, { status: 500 })
  }
} 