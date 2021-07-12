import MondayClient from "..";

export const updateColumn = (
  client: MondayClient,
  boardId: number,
  itemId: number,
  columnId: string,
  value: string
): Promise<{ id: number }> =>
  client.api<{ id: number }>(
    `mutation ($boardId: Int!, $itemId: Int!, $columnId: String!, $value: String!) {
      change_simple_column_value (board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
        id
      }
    }`,
    {
      boardId,
      itemId,
      columnId,
      value,
    }
  );
