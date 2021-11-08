export default class DifferentStatusError extends Error {
  constructor(status: string) {
    super(`Some items are not ${status}. Abort`);
  }
}
