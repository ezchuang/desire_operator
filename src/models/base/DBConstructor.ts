// 尚未寫到 ? 針對 column type 的 驗證

import mysql2, { Pool } from 'mysql2';

class Database {
    private pool: Pool;

    constructor() {
        this.pool = mysql2.createPool({
            user: process.env.DB_ADMIN,
            password: process.env.DB_PW,
            host: process.env.DB_HOST,
            port: 3306,
            // database: '',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0, // 0 表示無限等待
        });
    }

    getPool(): Pool {
        return this.pool;
    }
}

export default Database;