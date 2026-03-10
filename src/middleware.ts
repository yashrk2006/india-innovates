import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check for citizen verification token
    const isCitizenVerified = request.cookies.get("citizen_token");

    // Check for official role token
    const userRole = request.cookies.get("user_role");

    // Citizen Routes Protection
    if (pathname.startsWith("/citizen")) {
        // Allow access to verification page without token
        if (pathname === "/citizen/verify") {
            // But if already verified, redirect to home
            if (isCitizenVerified) {
                return NextResponse.redirect(new URL("/citizen", request.url));
            }
            return NextResponse.next();
        }

        // For all other citizen routes, require verification
        if (!isCitizenVerified && !userRole) {
            return NextResponse.redirect(new URL("/citizen/verify", request.url));
        }
    }

    // Official Dashboard Protection
    if (pathname.startsWith("/dashboard")) {
        if (!userRole) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }

        // Role-based routing for dashboard root
        if (pathname === "/dashboard") {
            const role = userRole.value;
            if (role === "super_admin" || role === "party_central") {
                return NextResponse.redirect(new URL("/dashboard/super-admin", request.url));
            } else {
                return NextResponse.redirect(new URL("/dashboard/party-central", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - auth (login/signup pages)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
    ],
};
