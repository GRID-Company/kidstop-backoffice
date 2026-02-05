import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthCookie } from './use-auth-cookie';
import { useAuthStore } from '@/lib/store/auth';

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
      if (redirect) router.push('/login');
    },
    [removeTokenCookie, router, clearSession]
  );

  return { logout, loading };
};
