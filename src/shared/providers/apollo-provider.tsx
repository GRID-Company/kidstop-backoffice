import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  InMemoryCache,
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { useMemo, PropsWithChildren } from 'react';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { RemoveTypenameFromVariablesLink } from '@apollo/client/link/remove-typename';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';
import { useAuthStore } from '../../lib/store/auth';
import { useLogout } from '@/lib/auth/use-process-logout';

export default function ApolloClientProvider({ children }: PropsWithChildren) {
  const token = useAuthStore((state) => state.token);
  const { logout } = useLogout();

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

    let isRedirecting = false;

    const errorLink = new ErrorLink(({ error, operation }) => {
      if (CombinedGraphQLErrors.is(error)) {
        const isAuthError =
          error.extensions?.code === 'UNAUTHENTICATED' ||
          error.extensions?.code === 'FORBIDDEN' ||
          error.extensions?.code === 401;

        if (isAuthError && !window.location.href.includes('/login') && !isRedirecting) {
          isRedirecting = true;
          logout('Sesión expirada. Por favor inicia sesión nuevamente.', false);
          window.location.href = '/login';
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
