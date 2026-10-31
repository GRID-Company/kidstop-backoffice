import type { CyHttpMessages } from 'cypress/types/net-stubbing';

export function getGraphQLOperationName(
  req: CyHttpMessages.IncomingHttpRequest
): string | null {
  const body = req.body as unknown;

  if (body && typeof body === 'object' && 'operationName' in body) {
    const operationName = (body as { operationName?: unknown }).operationName;
    return typeof operationName === 'string' ? operationName : null;
  }

  let text = '';
  if (typeof body === 'string') {
    text = body;
  } else if (body instanceof ArrayBuffer) {
    text = new TextDecoder().decode(body);
  } else if (ArrayBuffer.isView(body)) {
    text = new TextDecoder().decode(body);
  }

  const match = text.match(/"operationName"\s*:\s*"([^"]+)"/);
  return match ? match[1] : null;
}
