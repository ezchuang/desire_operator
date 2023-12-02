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

export interface CreateUserObj {
  userMail: string;
  userPw: string;
  userName: string;
  invitationCode?: string;
  groupName?: string;
}

export interface getUserDbObj {
  userMail: string;
  userPw?: string;
  userId?: string;
  dbUser?: string;
}

export interface CreateDbObj {
  dbName: string;
  groupName: string;
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
  offset?: number | 0;
  limit?: number | 100;
}

export interface UpdateObj {
  dbName: string;
  table: string;
  data: Record<string, any>;
  where?: Condition[];
}

export interface InsertObj {
  dbName: string;
  table: string;
  data: any;
}

export interface AddColumnObj {
  dbName: string;
  table: string;
  columnName: string;
  columnType: string;
  columnOption: string[];
  defaultValue: string;
}

export interface delColumnObj {
  dbName: string;
  table: string;
  columnName: string;
}

export interface DeleteObj {
  dbName: string;
  table?: string;
  where?: Condition[];
}

export interface HistoryRecord {
  id: string;
  actionType: string;
  queryHistory: string;
}

export interface UserPayload {
  userId: number;
  userEmail: string;
  userName: string;
  dbUser: string;
  invitationCode: string;
  groupName: string;
}
