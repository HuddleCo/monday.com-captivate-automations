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
