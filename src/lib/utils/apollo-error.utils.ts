import { CombinedGraphQLErrors } from '@apollo/client';
import { isAuthenticationError } from '../consts/auth';

export const isAuthApolloError = (error: unknown): boolean => {
  if (!CombinedGraphQLErrors.is(error)) return false;

  return error.errors.some((err) =>
    isAuthenticationError(
      err.extensions?.code ?? (err as { code?: unknown }).code,
      err.message
    )
  );
};
