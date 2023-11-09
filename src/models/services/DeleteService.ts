import DBServiceBase from './DbServiceBase';
import { DeleteObj } from 'models/interfaces/QueryObjInterfaces';

class DeleteService extends DBServiceBase {
    async delete(obj: DeleteObj) {
        const { dbName, table, where } = obj;
        const values: any[] = [];
        let queryStr = `DELETE FROM ${dbName}.${table}`;
    
        if (where && where.length > 0) {
            const whereClauses = where.map(condition => {
                values.push(condition.value)
                return `${condition.column} ${condition.operator} ?`;
            });
            queryStr += ' WHERE ' + whereClauses.join(' AND ');
        }
    
        return await this.execute(queryStr, values);
    }
}


export default DeleteService;
