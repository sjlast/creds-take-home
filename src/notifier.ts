export interface Notification {
  subject: string;
  body: string;
}

export interface Notifier {
  send(notification: Notification): Promise<void>;
}

export interface LogNotifierOptions {
  /** When true, every send rejects with an error. */
  fail?: boolean;
  log?: (line: string) => void;
}

/** A local notifier. It writes each message to the log and sends nothing. */
export function createLogNotifier(options: LogNotifierOptions = {}): Notifier {
  const log = options.log ?? ((line: string) => console.log(line));
  return {
    send(notification) {
      if (options.fail === true) {
        return Promise.reject(new Error('Notifier is set to fail (NOTIFIER_FAIL=true)'));
      }
      log(`notify: ${notification.subject} - ${notification.body}`);
      return Promise.resolve();
    },
  };
}

/** Builds the notifier from environment settings. */
export function createNotifierFromEnv(env: NodeJS.ProcessEnv = process.env): Notifier {
  return createLogNotifier({ fail: env['NOTIFIER_FAIL'] === 'true' });
}
