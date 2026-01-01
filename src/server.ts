import { buildApp } from './app.ts';
import { createNotifierFromEnv } from './notifier.ts';
import { createStore } from './store.ts';

const port = Number(process.env['PORT'] ?? 3000);

const app = buildApp({ store: createStore(), notifier: createNotifierFromEnv() });

try {
  await app.listen({ port, host: '127.0.0.1' });
  console.log(`Listening on http://127.0.0.1:${port}`);
} catch (error) {
  console.error(error);
  process.exit(1);
}
