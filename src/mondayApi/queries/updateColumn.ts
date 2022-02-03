import MondayApi from "..";

export const updateColumn = (
  client: MondayApi,
  boardId: string,
  itemId: number,
  columnId: string,
  value: string
): Promise<{ id: number }> =>
  client.api<{ id: number }>(
    `mutation ($boardId: String!, $itemId: Int!, $columnId: String!, $value: String!) {
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
