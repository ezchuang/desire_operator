import DBUtilityBase from "./DbUtilityBase";
import { DeleteObj } from "../base/Interfaces";

class DeleteUtility extends DBUtilityBase {
  async dropDatabase(obj: DeleteObj) {
    const { dbName } = obj;
    const queryStr = `DROP DATABASE IF EXISTS \`${dbName}\``;

    await this.execute(queryStr, []);

    return true;
  }

  async dropTable(obj: DeleteObj) {
    const { dbName, table } = obj;
    const queryStr = `DROP TABLE IF EXISTS \`${dbName}\`.\`${table}\``;

    console.log(queryStr, []);
    await this.execute(queryStr, []);

    return true;
  }

  async delete(obj: DeleteObj) {
    const { dbName, table, where } = obj;
    const values: any[] = [];
    let queryStr = `DELETE FROM ${dbName}.${table}`;

    console.log(where);
    if (where && where.length > 0) {
      const whereClauses = where.map((condition) => {
        values.push(condition.value);

        return `${condition.column} ${condition.operator} ?`;
      });

      queryStr += " WHERE " + whereClauses.join(" AND ");
    }

    console.log(queryStr, values);
    await this.execute(queryStr, values);

    return true;
  }
}

export default DeleteUtility;
