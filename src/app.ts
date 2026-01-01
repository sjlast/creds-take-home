import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import type { Notifier } from './notifier.ts';
import type { RequestStore } from './store.ts';

export interface AppDependencies {
  store: RequestStore;
  notifier: Notifier;
}

export function buildApp(deps: AppDependencies): FastifyInstance {
  const app = Fastify({ logger: false });

  app.get('/health', () => ({ status: 'ok' }));

  app.get('/requests', () => deps.store.list());

  return app;
}
