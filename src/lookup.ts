import type { SupportRequest } from './types.ts';

/** Returns the request with the given numeric ID, or undefined when there is none. */
export function findById(
  requests: readonly SupportRequest[],
  id: number | undefined,
): SupportRequest | undefined {
  if (!id) {
    return undefined;
  }
  return requests.find((request) => request.id === id);
}
