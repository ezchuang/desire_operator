import DBUtilityBase from "./DbUtilityBase";
import { DeleteObj } from "../base/Interfaces";
import addHistory from "../../controllers/addHistory";

class DeleteUtility extends DBUtilityBase {
  async dropDatabase(userId: string, obj: DeleteObj) {
    const { dbName } = obj;
    const queryStr = `DROP DATABASE IF EXISTS \`${dbName}\``;

    console.log(queryStr, []);
    await this.execute(queryStr, []);

    await addHistory(userId, "Delete Database", queryStr, []);

    return true;
  }

  async dropTable(userId: string, obj: DeleteObj) {
    const { dbName, table } = obj;
    const queryStr = `DROP TABLE IF EXISTS \`${dbName}\`.\`${table}\``;

    console.log(queryStr, []);
    await this.execute(queryStr, []);

    await addHistory(userId, "Delete Table", queryStr, []);

    return true;
  }

  async delete(userId: string, obj: DeleteObj) {
    const { dbName, table, where } = obj;
    const values: any[] = [];
    let queryStr = `DELETE FROM ${dbName}.${table}`;

    console.log(where);
    if (where && where.length > 0) {
      const whereClauses = where.map((condition) => {
        if (condition.value !== 0 && !condition.value) {
          return `\`${condition.column}\` IS NULL`;
        }
        values.push(condition.value);

        return `\`${condition.column}\` ${condition.operator} ?`;
      });

      queryStr += ` WHERE  ${whereClauses.join(" AND ")}`;
    }

    console.log(queryStr, values);
    await this.execute(queryStr, values);

    await addHistory(userId, "Delete Data", queryStr, values);

    return true;
  }
}

export default DeleteUtility;
