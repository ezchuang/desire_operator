import { Pool, PoolConnection, FieldPacket } from "mysql2";
import Database from "../dbConstructor/Database";

class DbUtilityBase {
  private database: Database;
  private pool: Pool;

  constructor(database: Database) {
    this.database = database;
    this.pool = database.getPool();
  }

  protected closeDbConnectionPool(): void {
    return this.database.closePool();
  }

  protected async getConnection(): Promise<PoolConnection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) reject(err);
        else resolve(connection);
      });
    });
  }

  protected async execute(queryStr: string, values: any[]) {
    const connection = await this.getConnection();
    try {
      const result = await new Promise<[any, FieldPacket[]]>(
        (resolve, reject) => {
          // console.log(queryStr, values);
          connection.query(queryStr, values, (err, res, fields) => {
            if (err) reject([err]);
            else resolve([res, fields]);
          });
        }
      );
      return result;
    } finally {
      connection.release();
    }
  }
}

export default DbUtilityBase;
