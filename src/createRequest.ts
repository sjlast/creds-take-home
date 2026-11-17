import { getNextId } from "./idGenerator.ts";
import type {
  Priority,
  SupportRequest,
  SupportRequestSubmission,
} from "./types.ts";
import { validateSubmission } from "./validator.ts";

/** Create a SupportRequest object from the properties specified in the creation submission. */
export function createSupportRequest(
  requestSubmission: SupportRequestSubmission,
): SupportRequest {
  if (!validateSubmission(requestSubmission)) {
    // this is going to cause Fastify to return a 500. In the future, it would be better to
    // implement an Error type system to turn it into a 400.
    throw new Error("Malformed or incomplete support request.");
  }
  const priority: Priority = requestSubmission.priority || "normal";
  let req: SupportRequest = {
    id: getNextId(),
    createdAt: new Date().toISOString(),
    priority,
    ...requestSubmission,
  };
  return req;
}
