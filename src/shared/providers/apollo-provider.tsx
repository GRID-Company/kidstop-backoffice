import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { useMemo, useRef, useEffect, PropsWithChildren } from 'react';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { RemoveTypenameFromVariablesLink } from '@apollo/client/link/remove-typename';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';
import { useAuthStore } from '../../lib/store/auth';
import { useLogout } from '@/lib/auth/use-process-logout';
import { AUTH_PAGE_PREFIXES } from '@/lib/consts/auth';
import { isAuthApolloError } from '@/lib/utils/apollo-error.utils';
import { ERROR_MESSAGES } from '@/lib/consts/error-messages';

export default function ApolloClientProvider({ children }: PropsWithChildren) {
  const token = useAuthStore((state) => state.token);
  const { logout } = useLogout();
  const redirectRef = useRef(false);

  useEffect(() => {
    redirectRef.current = false;
  }, [token]);

  const client = useMemo(() => {
    const authLink = new SetContextLink(({ headers }) => {
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : '',
          'Apollo-Require-Preflight': 'true',
        },
      };
    });

    const errorLink = new ErrorLink(({ error }) => {
      if (!isAuthApolloError(error)) return;

      const isAuthPage =
        typeof window !== 'undefined' &&
        AUTH_PAGE_PREFIXES.some((route) =>
          window.location.pathname.startsWith(route)
        );

      if (isAuthPage || redirectRef.current) return;

      redirectRef.current = true;
      logout(ERROR_MESSAGES.SESSION_EXPIRED);
    });

    const removeTypenameFromVariables = new RemoveTypenameFromVariablesLink();
    const uploadLink = new UploadHttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL,
    });

    return new ApolloClient({
      link: ApolloLink.from([
        authLink,
        errorLink,
        removeTypenameFromVariables,
        uploadLink,
      ]),
      cache: new InMemoryCache(),
      //     {
      //     typePolicies: {
      //       QuestionDataOutput: { keyFields: ['guid', 'title', 'id'] },
      //       QuestionOptionOutput: {
      //         keyFields: ['guid', 'answerString', 'id'],
      //       },
      //     },
      //   }
    });
  }, [token, logout]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
