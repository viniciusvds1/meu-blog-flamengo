import { NextResponse } from 'next/server';

export function middleware(request) {
  // Clone the response headers
  const response = NextResponse.next();
  const headers = new Headers(response.headers);

  // Cache control for static assets
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

  // Security headers
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
}

export const config = {
  matcher: [
    // Match all routes except API routes and Next.js internals
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
