import { type NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, user, response } = await createMiddlewareClient(request)
  const { pathname } = request.nextUrl

  // Already authenticated volunteer → skip volunteer login page
  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // /dashboard — require any valid session
  if (pathname.startsWith('/dashboard') && !user) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // /admin (but NOT /admin/login — that IS the auth page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // No session → send to admin login
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const { data: profile } = await supabase
      .from('users')
      .select('is_admin, role')
      .eq('id', user.id)
      .single()

    const isAdmin =
      (profile as { is_admin: boolean; role: string } | null)?.is_admin === true ||
      (profile as { is_admin: boolean; role: string } | null)?.role === 'Admin'

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Already-authed admin visits /admin/login → bounce to dashboard
  if (pathname === '/admin/login' && user) {
    const { data: profile } = await supabase
      .from('users')
      .select('is_admin, role')
      .eq('id', user.id)
      .single()

    const isAdmin =
      (profile as { is_admin: boolean; role: string } | null)?.is_admin === true ||
      (profile as { is_admin: boolean; role: string } | null)?.role === 'Admin'

    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  // Maintenance mode — skip admin, api, maintenance, and login routes
  const isPublicRoute =
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/maintenance') &&
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/dashboard')

  if (isPublicRoute) {
    try {
      const { data: setting } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'maintenance_mode')
        .maybeSingle()

      if ((setting as { value: string } | null)?.value === 'true') {
        return NextResponse.redirect(new URL('/maintenance', request.url))
      }
    } catch {
      // settings table may not exist yet — proceed normally
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
