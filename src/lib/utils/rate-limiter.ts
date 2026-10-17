export class RateLimiter {
  private queue: Array<() => void> = [];
  private lastExecutionTime = 0;
  private isProcessing = false;

  constructor(
    private minIntervalMs: number,
    private maxConcurrent: number = 1
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastExecution = now - this.lastExecutionTime;

      if (timeSinceLastExecution < this.minIntervalMs) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.minIntervalMs - timeSinceLastExecution)
        );
      }

      const task = this.queue.shift();
      if (task) {
        this.lastExecutionTime = Date.now();
        await task();
      }
    }

    this.isProcessing = false;
  }
}

export const visionApiRateLimiter = new RateLimiter(1000);
