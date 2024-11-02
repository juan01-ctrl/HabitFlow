import { NextRequest, NextResponse } from 'next/server';
import { getToken }                  from 'next-auth/jwt';

import { AUTH, TRACKER } from './enums/paths';

export { default } from 'next-auth/middleware'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  
  console.log('token', token)
  const authRoutes = ['/auth/sign-in', '/auth/sign-up'];
  
  if (authRoutes.includes(req.nextUrl.pathname) && token) {
    console.log('here 0 ')
    return NextResponse.redirect(new URL(TRACKER.ROOT, req.url));
  }

  if (!token && !authRoutes.includes(req.nextUrl.pathname)){
    console.log('here', { token, url: req.nextUrl.pathname })
    return NextResponse.redirect(new URL(AUTH.SIGN_IN, req.url));
  }

  
  return NextResponse.next();
}
  
export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico|imgs).*)'] }
