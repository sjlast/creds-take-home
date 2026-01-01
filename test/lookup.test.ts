import { describe, expect, it } from 'vitest';
import { findById } from '../src/lookup.ts';
import { createStore } from '../src/store.ts';

describe('findById', () => {
  const requests = createStore().list();

  it('finds a request by its ID', () => {
    expect(findById(requests, 1)?.title).toBe('Laptop will not charge');
  });

  it('returns undefined for an unknown ID', () => {
    expect(findById(requests, 99)).toBeUndefined();
  });

  it('returns undefined when no ID is given', () => {
    expect(findById(requests, undefined)).toBeUndefined();
  });

  it('finds the request with ID 0', () => {
    expect(findById(requests, 0)?.title).toBe('Reset my VPN token');
  });
});
