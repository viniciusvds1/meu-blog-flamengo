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
    const response = NextResponse.next();

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
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (request.nextUrl.pathname.startsWith('/api/')) {
      // API routes - shorter cache
      response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    } else {
      // Default cache for dynamic pages
      response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=300');
    }

    /**
     * Security headers.
     * 
     * Set various security headers to protect against common web vulnerabilities.
     */
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()');
    
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: http:",
      "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://*.supabase.co",
      "frame-src 'self' https://www.facebook.com https://www.youtube.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'"
    ].join('; ');
    
    response.headers.set('Content-Security-Policy', csp);
    
    // Performance headers
    response.headers.set('X-Powered-By', 'Next.js');
    
    // SEO headers
    if (request.nextUrl.pathname === '/') {
      response.headers.set('Link', '</assets/logooficialrubronews.png>; rel=preload; as=image');
    }

    return response;
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
