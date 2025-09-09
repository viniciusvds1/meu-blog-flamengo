import { NextResponse } from 'next/server';

/**
 * Middleware function to handle caching and security headers.
 * 
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} The modified response object with added headers.
 * @throws {Error} If an error occurs while processing the request.
 */
export function middleware(request) {
  try {
    // Clone the response headers
    const response = NextResponse.next();
    const headers = new Headers(response.headers);

    /**
     * Cache control for static assets.
     * 
     * If the request URL starts with '/_next/', '/assets/', or matches a file extension,
     * set the cache control header to cache for 1 week.
     * Otherwise, set the cache control header to cache for 1 hour.
     */
    if (
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname.startsWith('/assets/') ||
      request.nextUrl.pathname.match(/\.(jpg|jpeg|png|webp|gif|ico|css|js)$/)
    ) {
      // Cache for 1 week
      headers.set('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    } else {
      // Default cache for dynamic pages
      headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=300');
    }

    /**
     * Security headers.
     * 
     * Set various security headers to protect against common web vulnerabilities.
     */
    headers.set('X-DNS-Prefetch-Control', 'on');
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Create new response with added headers
    return NextResponse.next({
      request: {
        headers: headers,
      },
    });
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.error('Erro no middleware:', error);
    return new NextResponse(null, { status: 500 });
  }
}

/**
 * Configuration for the middleware.
 * 
 * Specify the routes that the middleware should match.
 */
export const config = {
  matcher: [
    // Match all routes except API routes and Next.js internals
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
