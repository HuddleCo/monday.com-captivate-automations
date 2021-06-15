import initMondayClient from "monday-sdk-js";
import { OptionsType, Response } from "../types";

class EditorToUploaderService {
  private mondayClient;

  private queryCounter: number;

  constructor(apiToken: string) {
    this.mondayClient = initMondayClient();
    this.mondayClient.setToken(apiToken);

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
