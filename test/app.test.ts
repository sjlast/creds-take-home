import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.ts';
import { createLogNotifier } from '../src/notifier.ts';
import { createStore } from '../src/store.ts';

function makeApp() {
  return buildApp({ store: createStore(), notifier: createLogNotifier({ log: () => undefined }) });
}

describe('GET /health', () => {
  it('answers 200', async () => {
    const response = await makeApp().inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });
});

describe('GET /requests', () => {
  it('lists the sample requests', async () => {
    const response = await makeApp().inject({ method: 'GET', url: '/requests' });
    expect(response.statusCode).toBe(200);
    const body = response.json<{ id: number; title: string }[]>();
    expect(body.map((request) => request.id)).toEqual([0, 1, 2]);
    expect(body[1]?.title).toBe('Laptop will not charge');
  });
});
