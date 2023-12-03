import DBUtilityBase from "./DbUtilityBase";
import {
  UpdateObj,
  InsertObj,
  AddColumnObj,
  delColumnObj,
} from "../base/Interfaces";
import addHistory from "../../controllers/addHistory";

class UpdateUtility extends DBUtilityBase {
  // 更新 Table 既有資料
  async update(userId: string, obj: UpdateObj) {
    const { dbName, table, data, where } = obj;
    const values: any[] = [];
    const setData: string[] = [];

    Object.entries(data).map(([key, val]) => {
      setData.push(`${key} = ?`);
      values.push(val);
    });

    let queryStr = `UPDATE \`${dbName}\`.\`${table}\` SET ${setData.join(
      ", "
    )}`;

    if (where && where.length > 0) {
      const whereClauses = where.map((condition) => {
        values.push(condition.value);
        return `${condition.column} ${condition.operator} ?`;
      });
      queryStr += " WHERE " + whereClauses.join(" AND ");
    }

    console.log(queryStr, values);
    await this.execute(queryStr, values);

    await addHistory(userId, "Update Data", queryStr, values);

    return true;
  }

  // 新增新的 Row
  async insert(userId: string, obj: InsertObj) {
    const { dbName, table, data } = obj;
    const columns = Object.keys(data[0]).join(", ");
    const insertData = data
      .map(() => `(${Object.keys(data[0]).fill("?").join(", ")})`)
      .join(", ");
    const values = data.flatMap(Object.values);

    const queryStr = `INSERT INTO \`${dbName}\`.\`${table}\` (${columns}) VALUES ${insertData}`;

    console.log(queryStr, values);
    await this.execute(queryStr, values);

    await addHistory(userId, "Insert Data", queryStr, values);

    return true;
  }

  // 變更 Table 新增 Column
  async addColumn(userId: string, obj: AddColumnObj) {
    try {
      const {
        dbName,
        table,
        columnName,
        columnType,
        columnOption,
        defaultValue,
      } = obj;

      let queryStr = `ALTER TABLE \`${dbName}\`.\`${table}\` ADD COLUMN \`${columnName}\` ${columnType}`;

      if (columnOption && columnOption.length > 0) {
        queryStr += ` ${columnOption.join(" ")}`;
      }

      if (defaultValue !== undefined && defaultValue !== null) {
        queryStr += ` DEFAULT '${defaultValue}'`;
      }

      console.log(queryStr);
      await this.execute(queryStr, []);

      await addHistory(userId, "Add Column", queryStr, []);

      return true;
    } catch (err) {
      console.error("Error in addColumn:", err);
      throw err;
    }
  }

  async delColumn(userId: string, obj: delColumnObj) {
    try {
      const { dbName, table, columnName } = obj;

      let queryStr = `ALTER TABLE \`${dbName}\`.\`${table}\` DROP COLUMN \`${columnName}\``;

      console.log(queryStr);
      await this.execute(queryStr, []);

      await addHistory(userId, "Delete Column", queryStr, []);

      return true;
    } catch (err) {
      console.error("Error in delColumn:", err);
      throw err;
    }
  }
}

export default UpdateUtility;
