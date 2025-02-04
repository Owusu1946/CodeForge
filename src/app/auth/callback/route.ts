import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(
          new URL('/auth/login?error=auth_callback_error', requestUrl.origin)
        )
      }

      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin), {
        status: 302,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      })
    }

    return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=unknown', request.url))
  }
} 