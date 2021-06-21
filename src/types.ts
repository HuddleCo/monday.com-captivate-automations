export type ItemType = {
  id: number;
  name: string;
  column_values: Array<ColumnValuesType>;
  board: BoardType;
  group: GroupType;
};

export type ColumnValuesType = {
  id: string;
  value: string;
  type: string;
  text: string;
  title: string;
};

export type BoardType = {
  id: number;
  name: string;
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
  groups: Array<GroupType>;
};

export type GroupType = {
  id: string;
  title: string;
  archived: boolean;
};

export type LinkColumnType = {
  url: string;
  text: string;
  changed_at: string;
};
