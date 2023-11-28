interface ForeignKeyReference {
  referencedTable?: string;
  referencedColumnName?: string;
}

export interface ColumnData {
  columnName: string;
  columnType: string;
  isUnsigned: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isNotNull: boolean;
  foreignKeyReference?: ForeignKeyReference;
}

export interface RowData {
  [key: string]: any;
}

interface WhereCondition {
  column: string;
  operator: string;
  value: any;
}

export interface UpdateObj {
  dbName: string;
  table: string;
  data: { [key: string]: any };
  where?: WhereCondition[];
}

export interface InsertObj {
  dbName: string;
  table: string;
  values: any[];
}

export interface HistoryRecord {
  name: string;
  action: string;
  query: string;
  timestamp: string;
}
