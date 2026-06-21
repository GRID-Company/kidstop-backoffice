import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PAGES = ['/login', '/nueva-contrasena', '/recuperar-contrasena'];
const PROTECTED_PREFIXES = ['/usuarios', '/clientes'];

const ROLE_ROUTES: Record<string, string[]> = {
  BUYER: ['/catalogo', '/compras', '/inventario-cartas', '/most-wanted', '/deck-builder'],
  RECEPTION: [
    '/catalogo',
    '/compras',
    '/inventario-cartas',
    '/ventas',
    '/clientes',
    '/most-wanted',
    '/deck-builder',
  ],
  ADMIN: [
    '/catalogo',
    '/compras',
    '/inventario-cartas',
    '/ventas',
    '/clientes',
    '/usuarios',
    '/configuracion',
    '/most-wanted',
    '/deck-builder',
  ],
  SUPERUSER: [
    '/catalogo',
    '/compras',
    '/inventario-cartas',
    '/ventas',
    '/clientes',
    '/usuarios',
    '/configuracion',
    '/most-wanted',
    '/deck-builder',
  ],
};

const DEFAULT_ROUTE_BY_ROLE: Record<string, string> = {
  BUYER: '/catalogo',
  RECEPTION: '/catalogo',
  ADMIN: '/catalogo',
  SUPERUSER: '/catalogo',
};

const startsWithAny = (pathname: string, prefixes: readonly string[]) =>
  prefixes.some((p) => pathname.startsWith(p));

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('jwt')?.value ?? null;
  const role = request.cookies.get('role')?.value ?? null;
  const logoutInProgress = request.cookies.get('logout_in_progress')?.value ?? null;

  if (startsWithAny(pathname, PUBLIC_PAGES) && token && !logoutInProgress) {
    const url = request.nextUrl.clone();
    if (role === 'ADMIN' || role === 'SUPERUSER') {
      url.pathname = '/usuarios';
    } else {
      url.pathname = '/catalogo';
    }
    return NextResponse.redirect(url);
  }

  if (startsWithAny(pathname, PROTECTED_PREFIXES) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';

    const res = NextResponse.redirect(url);
    res.cookies.delete('jwt');
    res.cookies.delete('role');
    res.cookies.delete('logout_in_progress');
    return res;
  }

  if (role && ROLE_ROUTES[role]) {
    const allowedRoutes = ROLE_ROUTES[role];
    const isProtectedRoute = Object.values(ROLE_ROUTES)
      .flat()
      .some((route) => pathname.startsWith(route));

    if (isProtectedRoute && !allowedRoutes.some((route) => pathname.startsWith(route))) {
      const defaultRoute = DEFAULT_ROUTE_BY_ROLE[role] || '/catalogo';
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|api).*)'],
};