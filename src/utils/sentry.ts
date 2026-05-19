import { SENTRY_ENABLED } from '@/config/sentry';

type SentryContext = Record<string, unknown>;

export function captureException(error: unknown, context?: SentryContext): void {
  if (!SENTRY_ENABLED) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Sentry = require('@sentry/react-native');
  Sentry.captureException(error, context);
}

export function setUser(user: Record<string, unknown>): void {
  if (!SENTRY_ENABLED) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Sentry = require('@sentry/react-native');
  Sentry.setUser(user);
}

export function initSentry(options: {
  dsn?: string;
  tracesSampleRate?: number;
  attachScreenshot?: boolean;
}): void {
  if (!SENTRY_ENABLED) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Sentry = require('@sentry/react-native');
  Sentry.init(options);
}

export function wrapApp<T>(component: T): T {
  if (!SENTRY_ENABLED) {
    return component;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Sentry = require('@sentry/react-native');
  return Sentry.wrap(component);
}
