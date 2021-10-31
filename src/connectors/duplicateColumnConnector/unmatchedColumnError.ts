export default class UnmatchedColumnError extends Error {
  constructor() {
    super("Could not find column. Abort");
  }
}
