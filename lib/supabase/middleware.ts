import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function createMiddlewareClient(request: NextRequest) {
  // holder.response is reassigned inside setAll whenever Supabase refreshes
  // the session token — using an object reference ensures the caller always
  // gets the most-recently-written response via the getter below.
  const holder = { response: NextResponse.next({ request }) }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          holder.response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            holder.response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() is the only call that may trigger a token refresh (setAll).
  // Do not add any code between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return {
    supabase,
    user,
    get response() {
      return holder.response
    },
  }
}
