export type ItemType = {
  name: string;
  board: {
    columns: Array<{
      title: string;
      type: string;
      id: string;
      settings_str: string;
      settings: {
        relation_column: {
          [id: string]: boolean;
        };
        displayed_column: {
          [id: string]: boolean;
        };
      };
    }>;
  };
  column_values: Array<ColumnValuesType>;
};

export type ColumnValuesType = {
  id: string;
  value: string;
  type: string;
  text: string;
  title: string;
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
  itemName?: string;
  columnValues?: string;
  groupName?: string;
  itemId?: number;
};

export type BoardRelationType = {
  linkedPulseIds: Array<{
    linkedPulseId: number;
  }>;
  changed_at: Date;
};
