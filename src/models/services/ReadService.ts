import DBServiceBase from "./DbServiceBase";
import {
  ReadDbsAndTablesObj,
  ReadObj,
} from "models/interfaces/QueryObjInterfaces";

class ReadService extends DBServiceBase {
  async readDBsAndTables(obj: ReadDbsAndTablesObj) {
    const { dbName } = obj;
    let queryStr = "SHOW ";

    if (dbName) {
      queryStr += `TABLES FROM ${dbName}`;
    } else {
      queryStr += "DATABASES";
    }

    return await this.execute(queryStr, []);
  }

  async read(obj: ReadObj) {
    const { dbName, table, select, where, orderBy, orderDirection, limit } =
      obj;
    const values: any[] = [];
    let queryStr = "SELECT ";

    if (select) {
      queryStr += select.join(", ");
    } else {
      queryStr += "*";
    }

    queryStr += ` FROM ${dbName}.${table}`;

    if (where && where.length > 0) {
      const whereClauses = where.map((condition) => {
        values.push(condition.value);
        return `${condition.column} ${condition.operator} ?`;
      });
      queryStr += " WHERE " + whereClauses.join(" AND ");
    }

    if (orderBy) {
      queryStr += ` ORDER BY ${orderBy}`;
      if (orderDirection) {
        queryStr += ` ${orderDirection}`;
      }
    }

    if (limit) {
      queryStr += " LIMIT ?";
      values.push(limit);
    }

    return await this.execute(queryStr, values);
  }
}

export default ReadService;
