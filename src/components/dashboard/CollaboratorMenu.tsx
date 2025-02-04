'use client'

import { useState } from 'react'
import { UserPlus, Share2, Check } from 'lucide-react'
import { useCollaboration } from '@/contexts/CollaborationContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export function CollaboratorMenu() {
  const { collaborators, inviteCollaborator, removeCollaborator, isLoading } = useCollaboration()
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleInvite = async () => {
    if (!inviteEmail) return
    setIsInviting(true)
    try {
      await inviteCollaborator(inviteEmail)
      setInviteEmail('')
      toast.success('Invitation sent successfully')
    } catch (error) {
      toast.error('Failed to send invitation')
    } finally {
      setIsInviting(false)
    }
  }

  const handleCopyLink = async () => {
    const inviteLink = `${window.location.origin}/invite/${btoa(window.location.pathname)}`
    try {
      await navigator.clipboard.writeText(inviteLink)
      setIsCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className="absolute top-full right-0 mt-1 w-64 bg-[#252526] rounded-sm shadow-lg border border-[#2d2d2d] py-2">
      <div className="px-3 py-2 border-b border-[#2d2d2d]">
        <h3 className="font-semibold mb-2">Collaborators</h3>
        {collaborators.map(collaborator => (
          <div key={collaborator.id} className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                {collaborator.name.slice(0, 2).toUpperCase()}
              </div>
              <span>{collaborator.name}</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              collaborator.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
            }`} />
          </div>
        ))}
      </div>
      
      <div className="px-3 py-2">
        <div className="flex gap-2 mb-2">
          <Input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
            placeholder="Email address"
            className="h-8 bg-[#3c3c3c] border-none text-sm"
          />
          <Button 
            onClick={handleInvite} 
            disabled={isInviting || !inviteEmail}
            className="h-8 px-2 min-w-[32px]"
          >
            <UserPlus className="w-4 h-4" />
          </Button>
        </div>
        <button 
          onClick={handleCopyLink}
          className="w-full text-left px-2 py-1.5 hover:bg-[#2d2d2d] rounded-sm flex items-center gap-2"
        >
          {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{isCopied ? 'Copied!' : 'Copy Share Link'}</span>
        </button>
      </div>
    </div>
  )
}