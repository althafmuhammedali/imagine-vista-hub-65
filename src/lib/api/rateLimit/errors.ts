export class RateLimitError extends Error {
  constructor(timeUntilReset: number) {
    const seconds = Math.ceil(timeUntilReset / 1000);
    super(`Rate limit exceeded. Please try again in ${seconds} seconds.`);
    this.name = 'RateLimitError';
  }
}