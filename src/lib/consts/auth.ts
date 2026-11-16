export const AUTH_CONSTANTS = {
  LOGOUT_REDIRECT_DELAY_MS: 100,
} as const;

export const AUTH_ERROR_CODES = {
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  UNAUTHORIZED_NUMERIC: 401,
  UNAUTHORIZED_STRING: '401',
} as const;

export const AUTH_ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized',
} as const;

export const isAuthenticationError = (
  code: unknown,
  message: string
): boolean => {
  return (
    code === AUTH_ERROR_CODES.UNAUTHENTICATED ||
    code === AUTH_ERROR_CODES.FORBIDDEN ||
    code === AUTH_ERROR_CODES.UNAUTHORIZED_NUMERIC ||
    code === AUTH_ERROR_CODES.UNAUTHORIZED_STRING ||
    message === AUTH_ERROR_MESSAGES.UNAUTHORIZED
  );
};

export const AUTH_PAGE_PREFIXES = [
  '/login',
  '/registro',
  '/recuperar-contrasena',
  '/cambiar-contrasena',
  '/nueva-contrasena',
] as const;

export const LOGIN_NEXT_PARAM = 'next';

export const sanitizeNextPath = (
  value: string | null | undefined
): string | null => {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null;
  return value;
};

export const buildLoginUrl = (next?: string | null): string => {
  const safe = sanitizeNextPath(next);
  return safe
    ? `/login?${LOGIN_NEXT_PARAM}=${encodeURIComponent(safe)}`
    : '/login';
};
