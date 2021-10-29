export default class MissingMondaySigningSecretError extends Error {
  constructor() {
    super("Missing MONDAY_SIGNING_SECRET");
  }
}
