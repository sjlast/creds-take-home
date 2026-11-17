import type { SupportRequest, SupportRequestSubmission } from "./types.ts";
import { createSupportRequest } from "./createRequest.ts";
import { findById } from "./lookup.ts";
import { getNextId } from "./idGenerator.ts";

const sampleData: readonly SupportRequest[] = [
  {
    id: getNextId(),
    title: "Reset my VPN token",
    priority: "normal",
    requester: "ana@example.com",
    createdAt: "2026-01-05T09:00:00.000Z",
  },
  {
    id: getNextId(),
    title: "Laptop will not charge",
    priority: "high",
    requester: "ben@example.com",
    createdAt: "2026-01-06T13:30:00.000Z",
  },
  {
    id: getNextId(),
    title: "Need access to the shared printer",
    priority: "low",
    requester: "chi@example.com",
    createdAt: "2026-01-07T08:15:00.000Z",
  },
];

export interface RequestStore {
  list(): readonly SupportRequest[];
  getById(id: number | undefined): SupportRequest | undefined;
  create(submission: SupportRequestSubmission): SupportRequest;
}

/** Holds support requests in memory. Data is lost when the process stops. */
export function createStore(
  initial: readonly SupportRequest[] = sampleData,
): RequestStore {
  const requests = [...initial];
  return {
    list: () => requests,
    getById: (id: number | undefined) => findById(requests, id),
    create: (submission: SupportRequestSubmission) => {
      const req = createSupportRequest(submission);
      requests.push(req);
      return req;
    },
  };
}
