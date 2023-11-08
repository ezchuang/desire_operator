import { Pool, PoolConnection } from 'mysql2';

class DatabaseServiceBase {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    protected async getConnection(): Promise<PoolConnection> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) reject(err);
                else resolve(connection);
            });
        });
    }
    
    protected async execute(queryStr: string, values: string[]) {
        const connection = await this.getConnection();
        try {
            const result = await new Promise((resolve, reject) => {
                connection.query(queryStr, values, (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                });
            });
            return result;
        } finally {
            connection.release();
        }
    }
}

export default DatabaseServiceBase;