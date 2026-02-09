import { useAuthStore } from '@/lib/store/auth';
import { UserRole } from './user-roles';
import { useAuthCookie } from './use-auth-cookie';
import { LoginOutput } from '../api/schema-types';
import { ERROR_MESSAGES } from '../consts/error-messages';
import { useRouter } from 'next/navigation';

export const useProcessLogin = () => {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const { setTokenCookie } = useAuthCookie();

  const processLogin = (data: LoginOutput | null) => {
    if (!data?.user) throw new Error(ERROR_MESSAGES.LOGIN_INVALID_RESPONSE);
    if (!data?.access_token) throw new Error(ERROR_MESSAGES.LOGIN_TOKEN_ERROR);

    setSession({ user: data.user, token: data.access_token });
    setTokenCookie(data.access_token, data.user.role);
    router.push('/usuarios');
  };

  return { processLogin };
};
