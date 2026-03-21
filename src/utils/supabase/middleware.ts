import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname;

  // --- AUTH BYPASS FOR DEMO/DEVELOPMENT ---
  // Allow all access regardless of user status
  return supabaseResponse;
  
  // Protect dashboard and citizen routes
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/citizen');

  if (isProtectedRoute && !user) {
    // Check if it's a citizen verification flow skip
    const isCitizenVerified = request.cookies.get('is_citizen_verified')?.value === 'true';
    if (path.startsWith('/citizen') && isCitizenVerified) {
       // Allow access if verified (demo mode)
       return supabaseResponse;
    }

    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // Double check for citizens who are logged in but not verified
  if (path.startsWith('/citizen')) {
      const isCitizenVerified = request.cookies.get('is_citizen_verified')?.value === 'true';
      if (!isCitizenVerified) {
          const url = request.nextUrl.clone()
          url.pathname = '/auth/verify-id'
          return NextResponse.redirect(url)
      }
  }

  // If user is logged in, redirect away from /auth to their dashboard or portal
  if (path.startsWith('/auth') && user) {
      // In a real app with roles, we'd check their role in the DB here or via cookies
      // For now, if they are authenticated and go to auth, redirect to citizen as default
      const roleCookie = request.cookies.get('user_role')?.value;
      
      const url = request.nextUrl.clone();
      if (roleCookie && ['ECI_OBSERVER', 'RO', 'SECTOR_CR', 'PARTY_CENTRAL', 'BOOTH_MANAGER', 'SUPER_ADMIN'].includes(roleCookie)) {
          url.pathname = '/dashboard';
      } else {
          url.pathname = '/citizen';
      }
      return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
