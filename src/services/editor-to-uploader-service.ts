import initMondayClient from "monday-sdk-js";

import type { ItemType } from "../types";

class EditorToUploaderService {
  private mondayClient;

  private cachedGetItem: Record<number, ItemType>;

  private queryCounter: number;

  constructor(apiToken: string) {
    this.mondayClient = initMondayClient();
    this.mondayClient.setToken(apiToken);

    this.cachedGetItem = {};
    this.queryCounter = 0;
  }

  async process(
    boardId: number,
    status: string,
    itemId: number
  ): Promise<string> {
    return new Promise((resolve) =>
      resolve(`${this.mondayClient} - ${boardId} - ${status} - ${itemId}`)
    );
  }
}

export default EditorToUploaderService;
