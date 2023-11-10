// 次要 interfaces
export interface TableColumn {
  name: string;
  type: string;
  options?: string[]; // ['NOT NULL', 'PRIMARY KEY']
}

export interface Condition {
  column: string;
  operator: ">" | "<" | "=" | ">=" | "<=";
  value: any;
}

// 主要 interfaces
export interface DatabaseConfigObj {
  user: string;
  password: string;
  host?: string;
  port?: number;
  waitForConnections?: boolean;
  connectionLimit?: number;
  queueLimit?: number;
}

export interface CreateDbObj {
  dbName: string;
  creatorUsername: string;
}

export interface CreateObj {
  dbName: string;
  table: string;
  columns: TableColumn[];
}

export interface ReadDbsAndTablesObj {
  dbName?: string;
}

export interface ReadObj {
  dbName: string;
  table: string;
  select?: string[];
  where?: Condition[];
  groupBy?: string;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
  limit?: number;
}

export interface UpdateObj {
  dbName: string;
  table: string;
  data: Record<string, any>;
  where?: Condition[];
}

export interface DeleteObj {
  dbName: string;
  table: string;
  where?: Condition[];
}
