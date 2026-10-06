const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, error?: Error | unknown) => {
    console.error(`[ERROR] ${message}`, error);
  },
};
