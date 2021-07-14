export default class MutexTimeoutError extends Error {
  constructor(duration: number) {
    super(`Mutex timed out after ${duration} ms`);
  }
}
