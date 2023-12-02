// 尚未寫到 ? 針對 column type 的 驗證
import mysql2, { Pool } from "mysql2";
import { DatabaseConfigObj } from "models/base/Interfaces";

class Database {
  private pool: Pool;

  constructor(config: DatabaseConfigObj) {
    // console.log(config);
    this.pool = mysql2.createPool({
      user: config.user,
      password: config.password,
      host: config.host,
      port: config.port || 3306,
      // database: '',
      waitForConnections: config.waitForConnections || true,
      connectionLimit: config.connectionLimit || 10,
      queueLimit: config.queueLimit || 0, // 0 表示無限等待
    });
    // console.log("DB connect success.");
  }

  getPool(): Pool {
    return this.pool;
  }

  closePool(): void {
    return this.pool.end();
  }
}

export default Database;
