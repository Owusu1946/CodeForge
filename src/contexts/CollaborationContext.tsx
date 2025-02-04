 'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '@/lib/supabase'

interface Collaborator {
  id: string
  email: string
  name: string
  avatarUrl?: string
  status: 'online' | 'offline'
}

interface CollaborationContextType {
  collaborators: Collaborator[]
  inviteCollaborator: (email: string) => Promise<void>
  removeCollaborator: (userId: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

const CollaborationContext = createContext<CollaborationContextType | null>(null)

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const loadCollaborators = async () => {
      try {
        const { data, error } = await supabase
          .from('collaborators')
          .select('user_id, users(id, email, name, avatar_url, status)')
          .eq('project_id', user.id)

        if (error) throw error

        setCollaborators(data.map((item: any) => ({
          id: item.users.id,
          email: item.users.email,
          name: item.users.name,
          avatarUrl: item.users.avatar_url,
          status: item.users.status
        })))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load collaborators')
      } finally {
        setIsLoading(false)
      }
    }

    loadCollaborators()

    // Subscribe to collaborator changes
    const channel = supabase
      .channel('collaborators')
      .on('presence', { event: 'sync' }, () => {
        loadCollaborators()
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user])

  const inviteCollaborator = async (email: string) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from('collaborator_invites')
        .insert({
          project_id: user.id,
          email,
          status: 'pending'
        })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite collaborator')
    }
  }

  const removeCollaborator = async (userId: string) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('project_id', user.id)
        .eq('user_id', userId)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove collaborator')
    }
  }

  return (
    <CollaborationContext.Provider value={{
      collaborators,
      inviteCollaborator,
      removeCollaborator,
      isLoading,
      error
    }}>
      {children}
    </CollaborationContext.Provider>
  )
}

export const useCollaboration = () => {
  const context = useContext(CollaborationContext)
  if (!context) throw new Error('useCollaboration must be used within CollaborationProvider')
  return context
}