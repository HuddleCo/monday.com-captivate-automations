export type ItemType = {
  name: string;
  column_values: Array<{
    id: string;
    value: string;
    type: string;
    text: string;
    title: string;
  }>;
  board: {
    id: number;
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
  group: GroupType;
};

export type GroupType = {
  id: string;
};
