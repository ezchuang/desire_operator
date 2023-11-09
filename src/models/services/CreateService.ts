import DbServiceBase from './DbServiceBase';
import { CreateDbObj, CreateObj } from 'models/interfaces/QueryObjInterfaces';

class CreateService extends DbServiceBase {
    // 需求權限等級較高，所以從比較前面開始做 SQL injection 預防，避免使用者異常嫁接指令
    async createDb(obj: CreateDbObj) {
        const { dbName, creatorUsername } = obj;

        let queryStr = `CREATE DATABASE IF NOT EXISTS ?`;
        await this.execute(queryStr, [dbName]);
    
        queryStr = `GRANT ALL PRIVILEGES ON ?.* TO ?@'localhost' WITH GRANT OPTION`;
        await this.execute(queryStr, [dbName, creatorUsername]);
    
        queryStr = `FLUSH PRIVILEGES`;
        await this.execute(queryStr, []);

        // 因為跟其他函式結構不同，這邊在成功後 return true
        // 失敗理應會由 this.execute() throw error
        return true; 
    }

    // 一般權限即可執行，所以正常組裝指令即可
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
