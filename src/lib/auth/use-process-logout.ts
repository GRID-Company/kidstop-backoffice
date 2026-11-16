import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthCookie } from './use-auth-cookie';
import { useAuthStore } from '@/lib/store/auth';
import {
  AUTH_CONSTANTS,
  AUTH_PAGE_PREFIXES,
  buildLoginUrl,
} from '@/lib/consts/auth';

export const useLogout = () => {
  const clearSession = useAuthStore((state) => state.clearSession);
  const [loading, setLoading] = useState(false);
  const { removeTokenCookie } = useAuthCookie();
  const router = useRouter();

  const logout = useCallback(
    async (toastMessage = 'Sesión terminada con éxito.', redirect = true) => {
      setLoading(true);

      await removeTokenCookie();
      clearSession();

      setLoading(false);
      toast.success(toastMessage);

      if (redirect) {
        await new Promise((resolve) =>
          setTimeout(resolve, AUTH_CONSTANTS.LOGOUT_REDIRECT_DELAY_MS)
        );
        const pathname =
          typeof window !== 'undefined' ? window.location.pathname : null;
        const isAuthPage = AUTH_PAGE_PREFIXES.some((route) =>
          pathname?.startsWith(route)
        );
        router.push(buildLoginUrl(isAuthPage ? null : pathname));
      }
    },
    [removeTokenCookie, router, clearSession]
  );

  return { logout, loading };
};
