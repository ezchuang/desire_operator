// import { Pool } from 'mysql2';
import DBServiceBase from './DBServiceBase ';
import { CreateDBObj, CreateObj } from 'models/interfaces/QueryObjInterfaces';

class CreateService extends DBServiceBase {
    async createDB(obj: CreateDBObj) {
        const { dbName, creatorUsername } = obj;

        let queryStr = `CREATE DATABASE IF NOT EXISTS ${dbName}`;
        await this.execute(queryStr, []);
    
        queryStr = `GRANT ALL PRIVILEGES ON ${dbName}.* TO ?@'localhost' WITH GRANT OPTION`;
        await this.execute(queryStr, [creatorUsername]);
    
        queryStr = `FLUSH PRIVILEGES`;
        await this.execute(queryStr, []);
    }

    async create(obj: CreateObj) {
        const { dbName, table, columns } = obj;
        const columnsClauses: string[] = [];
        let queryStr = `CREATE TABLE ${dbName}.${table} (`;
        
        for (const column of columns) {
            columnsClauses.push(`${column.name} ${column.type} ${column.options?.join(' ') || ''}`);
        }
    
        queryStr += columnsClauses.join(', ');
        queryStr += ')';
    
        return await this.execute(queryStr, []);
    }
}


export default CreateService;
