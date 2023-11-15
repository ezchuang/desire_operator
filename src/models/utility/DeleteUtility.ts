import DBUtilityBase from "./DbUtilityBase";
import { DeleteObj } from "models/base/QueryObjInterfaces";

class DeleteUtility extends DBUtilityBase {
  async delete(obj: DeleteObj) {
    const { dbName, table, where } = obj;
    const values: any[] = [];
    let queryStr = `DELETE FROM ${dbName}.${table}`;

    if (where && where.length > 0) {
      const whereClauses = where.map((condition) => {
        values.push(condition.value);
        return `${condition.column} ${condition.operator} ?`;
      });
      queryStr += " WHERE " + whereClauses.join(" AND ");
    }

    return await this.execute(queryStr, values);
  }
}

export default DeleteUtility;
