import { performQuery } from "./queryCounter";

export default async (
  token: string,
  boardId: number,
  status: string,
  itemId: number
): Promise<string> => {
  await performQuery(token, "", {});
  return new Promise((resolve) =>
    resolve(`${token} - ${boardId} - ${status} - ${itemId}`)
  );
};
