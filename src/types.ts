export type ItemType = {
  name: string;
  column_values: Array<ColumnValuesType>;
};

export type ColumnValuesType = {
  id: string;
  value: string;
  type: string;
};

export type GroupType = {
  id: number;
};

export type ParsedColumnValuesType = { [id: string]: string };

export type Response = {
  errors?: string;
  data: unknown;
};

export type CreateItemType = {
  create_item: {
    id: number;
  };
};

export type CreateGroupType = {
  create_group: {
    id: number;
  };
};

export type GetItemsType = {
  items: Array<ItemType>;
};

export type OptionsType = {
  boardId?: number;
  groupId?: number;
  content?: string;
  columnValues?: string;
  groupName?: string;
  itemId?: number;
};
