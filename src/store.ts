import type { SupportRequest } from './types.ts';

const sampleData: readonly SupportRequest[] = [
  {
    id: 0,
    title: 'Reset my VPN token',
    priority: 'normal',
    requester: 'ana@example.com',
    createdAt: '2026-01-05T09:00:00.000Z',
  },
  {
    id: 1,
    title: 'Laptop will not charge',
    priority: 'high',
    requester: 'ben@example.com',
    createdAt: '2026-01-06T13:30:00.000Z',
  },
  {
    id: 2,
    title: 'Need access to the shared printer',
    priority: 'low',
    requester: 'chi@example.com',
    createdAt: '2026-01-07T08:15:00.000Z',
  },
];

export interface RequestStore {
  list(): readonly SupportRequest[];
}

/** Holds support requests in memory. Data is lost when the process stops. */
export function createStore(initial: readonly SupportRequest[] = sampleData): RequestStore {
  const requests = [...initial];
  return {
    list: () => requests,
  };
}
