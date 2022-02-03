export type ItemType = {
  id: number;
  name: string;
  state: string;
  column_values: Array<ColumnValuesType>;
  board: BoardType;
  group: GroupType;
};

export type ColumnValuesType = {
  id: string;
  value: string | null;
  type: string;
  text: string;
  title: string;
};

export type BoardType = {
  id: string;
  name: string;
  columns: Array<BoardColumnsType>;
  groups: Array<GroupType>;
};

export type BoardColumnsType = {
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
};

export type GroupType = {
  id: string;
  title: string;
  archived: boolean;
  position: number;
};

export type LinkColumnType = {
  url: string;
  text: string;
  changed_at: string;
};

export type Data<T> = {
  data: T;
};

export type RuntimeErrorType = {
  errors: Array<{
    message: string;
  }>;
};

export type SyntaxErrorType = {
  error_message: string;
};

export type ApiResponse<T> = Data<T> | RuntimeErrorType | SyntaxErrorType;
