'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (loading) return

    if (user) {
      router.push('/dashboard')
      
    }
  }, [user, loading, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center text-foreground">
            Welcome to CodeForge
          </h1>
          
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#000000',
                    brandAccent: '#666666',
                  }
                }
              }
            }}
            providers={['github', 'google']}
            redirectTo={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`}
            view="sign_in"
            showLinks={false}
            socialLayout="horizontal"
            onError={(error) => {
              console.error('Auth error:', error)
              setError('Authentication failed. Please try again.')
            }}
          />
        </div>
      )}
    </div>
  )
} 