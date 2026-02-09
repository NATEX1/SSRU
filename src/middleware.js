import { NextResponse } from 'next/server'

export function middleware(request) {
    const url = request.nextUrl.clone()
    const hostname = request.headers.get('host')

    // Check if hostname starts with www.
    if (hostname && hostname.startsWith('www.')) {
        // Remove 'www.' from the hostname
        const newHostname = hostname.replace(/^www\./, '')
        url.hostname = newHostname
        url.protocol = 'https' // Ensure HTTPS

        // Perform 301 Permanent Redirect
        return NextResponse.redirect(url, 301)
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
