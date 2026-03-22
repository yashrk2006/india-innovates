import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
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

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl
    
    // --- AUTH BYPASS FOR DEMO ---
    return supabaseResponse;
    
    // Check for citizen verification token (Legacy cookie check)
    const isCitizenVerified = request.cookies.get("citizen_token")
    
    // Check for official role token
    const userRole = request.cookies.get("user_role")

    // Citizen Routes Protection
    if (pathname.startsWith("/citizen")) {
        // Allow access to verification page without token
        if (pathname === "/citizen/verify") {
            if (isCitizenVerified) {
                return NextResponse.redirect(new URL("/citizen", request.url))
            }
            return supabaseResponse
        }

        // For all other citizen routes, require verification OR auth
        if (!isCitizenVerified && !user && !userRole) {
            return NextResponse.redirect(new URL("/citizen/verify", request.url))
        }
    }

    // Official Dashboard Protection
    if (pathname.startsWith("/dashboard")) {
        if (!user && !userRole) {
            return NextResponse.redirect(new URL("/auth/login", request.url))
        }

        // Role-based routing for dashboard root
        if (pathname === "/dashboard") {
            const role = userRole?.value || (user?.user_metadata?.role as string)
            if (role === "super_admin" || role === "party_central" || role === "super-admin") {
                return NextResponse.redirect(new URL("/dashboard/super-admin", request.url))
            } else if (role) {
                // Map complex roles to dashboard sub-routes
                const rolePath = role.replace(/_/g, '-');
                return NextResponse.redirect(new URL(`/dashboard/${rolePath}`, request.url))
            }
        }
    }
    
    // Redirect logged in users away from auth
    if (pathname.startsWith('/auth') && user) {
        const role = ((user as any).user_metadata?.role || (userRole as any)?.value || 'citizen') as string;
        const url = request.nextUrl.clone()
        if (role === 'citizen') {
            url.pathname = '/citizen'
        } else {
            url.pathname = '/dashboard'
        }
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - *.svg, *.png, etc. (static assets)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
