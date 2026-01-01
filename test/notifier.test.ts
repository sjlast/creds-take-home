import { describe, expect, it } from 'vitest';
import { createLogNotifier, createNotifierFromEnv } from '../src/notifier.ts';

describe('log notifier', () => {
  it('logs the message and resolves', async () => {
    const lines: string[] = [];
    const notifier = createLogNotifier({ log: (line) => lines.push(line) });
    await notifier.send({ subject: 'New request', body: 'Laptop will not charge' });
    expect(lines).toEqual(['notify: New request - Laptop will not charge']);
  });

  it('rejects every send when set to fail', async () => {
    const lines: string[] = [];
    const notifier = createLogNotifier({ fail: true, log: (line) => lines.push(line) });
    await expect(notifier.send({ subject: 'a', body: 'b' })).rejects.toThrow('NOTIFIER_FAIL=true');
    await expect(notifier.send({ subject: 'c', body: 'd' })).rejects.toThrow('NOTIFIER_FAIL=true');
    expect(lines).toEqual([]);
  });

  it('fails only when NOTIFIER_FAIL is "true"', async () => {
    const failing = createNotifierFromEnv({ NOTIFIER_FAIL: 'true' });
    await expect(failing.send({ subject: 'a', body: 'b' })).rejects.toThrow();
    const working = createNotifierFromEnv({ NOTIFIER_FAIL: 'false' });
    await expect(working.send({ subject: 'a', body: 'b' })).resolves.toBeUndefined();
  });
});
