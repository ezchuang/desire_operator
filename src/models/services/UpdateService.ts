// import { Pool } from 'mysql2';
import DBServiceBase from './DBServiceBase ';
import { UpdateObj } from 'models/interfaces/QueryObjInterfaces';

class UpdateService extends DBServiceBase {
    async update(obj: UpdateObj) {
        const { dbName, table, data, where } = obj;
        const values: any[] = [];
        const setData: string[] = [];

        Object.entries(data).map(([key, val]) => {
            setData.push(`${key} = ?`);
            values.push(val)
        });

        let queryStr = `UPDATE ${dbName}.${table} SET ${setData.join(', ')}`;
        
        if (where && where.length > 0) {
            const whereClauses = where.map(condition => {
                values.push(condition.value);
                return `${condition.column} ${condition.operator} ?`;
            });
            queryStr += ' WHERE ' + whereClauses.join(' AND ');
        }
        
        return await this.execute(queryStr, values);
    }
}


export default UpdateService;
