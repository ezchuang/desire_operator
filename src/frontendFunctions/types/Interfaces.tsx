// interface ForeignKeyReference {
//   referencedTable?: string;
//   referencedColumnName?: string;
// }

export interface ColumnData {
  columnName: string;
  columnType: string;
  columnSizeLimit?: number;
  defaultValue?: string;

  isNotNull: boolean;
  isPrimaryKey: boolean;
  isUniqueKey: boolean;
  isUnsigned: boolean;
  isAutoIncrement: boolean;
  isZerofill: boolean;
  // isForeignKey: boolean;
  // foreignKeyReference?: ForeignKeyReference;
}

export interface TableData {
  dbName: string;
  table: string;
  columns: any[];
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

export interface AddColumnObj {
  dbName: string;
  table: string;
  columnName: string;
  columnType: string;
  columnOption?: string[];
  defaultValue?: string | null;
}

export interface delColumnObj {
  dbName: string;
  table: string;
  columnName: string;
}

export interface HistoryRecord {
  name: string;
  action: string;
  query: string;
  timestamp: number;
}
