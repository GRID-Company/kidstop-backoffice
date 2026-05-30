interface GraphQLError {
  graphQLErrors?: Array<{ message: string }>;
  message?: string;
}

export function translateGraphQLError(error: GraphQLError, defaultMessage: string): string {
  const errorMessage = error?.graphQLErrors?.[0]?.message || error?.message || defaultMessage;
  
  if (errorMessage.includes('Insufficient stock')) {
    const match = errorMessage.match(/Available: (\d+), requested increase: (\d+)/);
    if (match) {
      return `Stock insuficiente. Disponible: ${match[1]}, incremento solicitado: ${match[2]}.`;
    }
    return 'Stock insuficiente para completar la operación.';
  }
  
  return errorMessage;
}
