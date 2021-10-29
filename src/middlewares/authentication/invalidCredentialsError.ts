export default class InvalidCredentialsError extends Error {
  constructor() {
    super("authentication error, could not verify credentials");
  }
}
