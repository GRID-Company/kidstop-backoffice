import { useCallback } from 'react';

export const useAuthCookie = () => {
  const setTokenCookie = useCallback(
    async (accessToken: string, userRole: string) => {
      return await fetch('/api/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken, userRole }),
      });
    },
    []
  );

  const removeTokenCookie = useCallback(async () => {
    return await fetch('/api/logout', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }, []);

  return { setTokenCookie, removeTokenCookie };
};
