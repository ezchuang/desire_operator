import DBUtilityBase from "./DbUtilityBase";
import { UpdateObj, InsertObj } from "../base/Interfaces";

class UpdateUtility extends DBUtilityBase {
  // 更新 Table 既有資料
  async update(obj: UpdateObj) {
    const { dbName, table, data, where } = obj;
    const values: any[] = [];
    const setData: string[] = [];

    Object.entries(data).map(([key, val]) => {
      setData.push(`${key} = ?`);
      values.push(val);
    });

    let queryStr = `UPDATE ${dbName}.${table} SET ${setData.join(", ")}`;

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

  // 新增新的 Row
  async insert(obj: InsertObj) {
    const { dbName, table, data } = obj;
    const columns = Object.keys(data[0]).join(", ");
    const placeholders = data
      .map(() => `(${Object.keys(data[0]).fill("?").join(", ")})`)
      .join(", ");
    const values = data.flatMap(Object.values);

    const queryStr = `INSERT INTO ${dbName}.${table} (${columns}) VALUES ${placeholders}`;

    console.log(queryStr, values);
    await this.execute(queryStr, values);

    return true;
  }
}

export default UpdateUtility;
