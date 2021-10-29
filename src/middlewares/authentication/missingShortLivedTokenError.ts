export default class MissingShortLivedTokenError extends Error {
  constructor() {
    super("shortLivedToken is not provided");
  }
}
