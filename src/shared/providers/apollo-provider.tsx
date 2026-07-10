import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  InMemoryCache,
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { useMemo, useRef, PropsWithChildren } from 'react';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { RemoveTypenameFromVariablesLink } from '@apollo/client/link/remove-typename';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';
import { useAuthStore } from '../../lib/store/auth';
import { useLogout } from '@/lib/auth/use-process-logout';

export default function ApolloClientProvider({ children }: PropsWithChildren) {
  const token = useAuthStore((state) => state.token);
  const { logout } = useLogout();
  const redirectRef = useRef(false);

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

    const errorLink = new ErrorLink(({ error, operation }) => {
      if (CombinedGraphQLErrors.is(error)) {
        const code = error.extensions?.code;
        const message = error.message;
        const isAuthError =
          code === 'UNAUTHENTICATED' ||
          code === 'FORBIDDEN' ||
          code === 401 ||
          message === 'Unauthorized';

        if (isAuthError && !redirectRef.current && !window.location.href.includes('/login')) {
          redirectRef.current = true;
          logout('Sesión expirada. Por favor inicia sesión nuevamente.', false);
          setTimeout(() => {
            window.location.href = '/login';
          }, 150);
        }
      }
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
  }, [token]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
