import MondayApi from "..";

export const updateColumn = (
  client: MondayApi,
  boardId: bigint,
  itemId: bigint,
  columnId: string,
  value: string
): Promise<{ id: bigint }> =>
  client.api<{ id: bigint }>(
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
