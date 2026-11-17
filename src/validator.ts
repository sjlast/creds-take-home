import type { SupportRequestSubmission } from "./types.ts";

export function validateSubmission(
  requestSubmission: SupportRequestSubmission,
): boolean {
  if (
    !requestSubmission.title ||
    (requestSubmission.priority &&
      requestSubmission.priority != "low" &&
      requestSubmission.priority != "normal" &&
      requestSubmission.priority != "high")
  ) {
    return false;
  }
  return true;
}
