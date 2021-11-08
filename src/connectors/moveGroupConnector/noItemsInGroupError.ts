export default class NoItemsInGroupError extends Error {
  constructor() {
    super("The group has no items. Have already been processed");
  }
}
