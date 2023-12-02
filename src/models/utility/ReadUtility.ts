import DBUtilityBase from "./DbUtilityBase";
import { ReadDbsAndTablesObj, ReadObj } from "../base/Interfaces";

class ReadUtility extends DBUtilityBase {
  // 讀取 DBs or Tables
  async readDbsOrTables(obj: ReadDbsAndTablesObj) {
    const { dbName } = obj;
    let queryStr = "SHOW ";

    if (dbName) {
      queryStr += `TABLES FROM \`${dbName}\``;

      console.log(queryStr, []);
      return await this.execute(queryStr, []);
    } else {
      queryStr += "DATABASES";

      console.log(queryStr, []);
      return await this.execute(queryStr, []);
    }
  }

  // 讀取 Table 內部資料
  async read(obj: ReadObj) {
    const { dbName, table, select, where, orderBy, orderDirection, limit } =
      obj;
    const values: any[] = [];
    let queryStr = "SELECT ";

    if (select && select.length > 0) {
      queryStr += select.join(", ");
    } else {
      queryStr += "*";
    }

    // 這段要再改，看是改成 return [false, errMsg] 如何
    if (!dbName || !table) {
      throw new Error("Database name or table name is missing or invalid.");
    }

    queryStr += ` FROM \`${dbName}\`.\`${table}\``;

    if (where && where.length > 0) {
      const whereClauses = where.map((condition) => {
        values.push(condition.value);
        return `\`${condition.column}\` ${condition.operator} ?`;
      });
      queryStr += " WHERE " + whereClauses.join(" AND ");
    }

    if (orderBy) {
      queryStr += ` ORDER BY \`${orderBy}\``;
      if (orderDirection) {
        queryStr += ` ${orderDirection}`;
      }
    }

    if (limit) {
      queryStr += " LIMIT ?";
      values.push(limit);
    }

    console.log(queryStr, values);
    return await this.execute(queryStr, values);
  }

  // 取得 [{COLUMN_NAME, DATA_TYPE}]
  async readTableStructures(obj: ReadObj) {
    const { dbName, table } = obj;
    let queryStr = `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`;

    console.log(queryStr, [dbName, table]);
    return await this.execute(queryStr, [dbName, table]);
  }
}

export default ReadUtility;
