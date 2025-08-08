import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const myCookie = request.cookies.get('token')?.value;

  const response = NextResponse.next();
  response.headers.set('userId', myCookie || '');
  return response;
}

export const config = {
  matcher: ['/api/:path*'], // apply only to API routes
};
