import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PAGES = ['/login', '/nueva-contrasena', '/recuperar-contrasena'];
const PROTECTED_PREFIXES = ['/usuarios'];

const startsWithAny = (pathname: string, prefixes: readonly string[]) =>
  prefixes.some((p) => pathname.startsWith(p));

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('jwt')?.value ?? null;
  const role = request.cookies.get('role')?.value ?? null;

  if (startsWithAny(pathname, PUBLIC_PAGES) && token) {
    const url = request.nextUrl.clone();
    if (role === 'ADMIN' || role === 'SUPERUSER') {
      url.pathname = '/usuarios';
    } else {
      url.pathname = '/usuarios';
    }
    return NextResponse.redirect(url);
  }

  if (startsWithAny(pathname, PROTECTED_PREFIXES) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';

    const res = NextResponse.redirect(url);
    res.cookies.delete('jwt');
    res.cookies.delete('role');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|api).*)'],
};
