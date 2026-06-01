import { NextResponse, type NextRequest } from 'next/server';

// V3 placeholder. V9 swaps in real session cookie verification via Firebase Admin.
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/login') {
    // Real check happens client-side via <RequireAdmin>. Middleware just lets it through.
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
