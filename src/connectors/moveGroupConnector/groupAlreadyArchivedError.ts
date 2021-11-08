export default class GroupAlreadyArchivedError extends Error {
  constructor() {
    super("The group has already been archived");
  }
}
