import { supabase } from '@/lib/supabase'

export interface TemplateConfig {
  name: string
  type: 'react' | 'next' | 'vue'
  commands: string[]
  files: {
    path: string
    content: string
  }[]
}

const REACT_TEMPLATE: TemplateConfig = {
  name: 'React',
  type: 'react',
  commands: [
    'npm create vite@latest . -- --template react-ts',
    'npm install',
    'npm run dev'
  ],
  files: [
    {
      path: 'src/main.tsx',
      content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
    },
    {
      path: 'src/App.tsx',
      content: `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  )
}
        
export default App`
    },
    {
      path: 'src/App.css',
      content: `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.card {
  padding: 2em;
}`
    },
    {
      path: 'src/index.css',
      content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`
    },
    {
      path: 'package.json',
      content: `{
  "name": "react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}`
    }
  ]
}

export const templateService = {
  async initializeTemplate(userId: string, templateType: 'react' | 'next' | 'vue') {
    const template = templateType === 'react' ? REACT_TEMPLATE : null
    if (!template) throw new Error('Template not found')

    try {
      // Create workspace first
      const workspaceResponse = await fetch('/api/workspace/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, templateType })
      })

      if (!workspaceResponse.ok) {
        throw new Error('Failed to create workspace')
      }

      // Create files in Supabase
      const filePromises = template.files.map(file => 
        supabase.from('files').insert({
          id: crypto.randomUUID(),
          user_id: userId,
          name: file.path,
          type: file.path.includes('.') ? 'file' : 'folder',
          content: file.content,
          parent_id: file.path.split('/').slice(0, -1).join('/') || null
        })
      )

      await Promise.all(filePromises)

      return {
        ...template,
        commands: [
          'npm install --legacy-peer-deps',
          'npm run dev -- --port 3002'
        ]
      }
    } catch (error) {
      console.error('Template initialization failed:', error)
      throw error
    }
  }
} 