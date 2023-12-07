import DbUtilityBase from "./DbUtilityBase";
import { CreateDbObj, CreateObj } from "models/base/Interfaces";
import addHistory from "../../controllers/addHistory";

class CreateUtility extends DbUtilityBase {
  // 需求權限等級較高，所以從比較前面開始做 SQL injection 預防，避免使用者異常嫁接指令
  async createDb(userId: string, obj: CreateDbObj) {
    const { dbName, groupSigninUser } = obj;
    // 主要新增
    let queryStr = `CREATE DATABASE IF NOT EXISTS \`${dbName}\``;

    console.log(queryStr, []);
    await this.execute(queryStr, []);

    // Guest 路徑，因為只有超級使用者能創建Database，所以跳過刷新行為
    if (String(userId).startsWith("G")) {
      return true;
    }

    await addHistory(userId, "Create Database", queryStr, []);

    const signinUser = groupSigninUser;
    // 超級使用者尾綴不同，且根本不用特別加權限
    if (signinUser === "admin" || signinUser === "root") {
      return true;
    }

    queryStr = `GRANT ALL PRIVILEGES ON \`${dbName}\`.* TO ?@'%' WITH GRANT OPTION`;
    await this.execute(queryStr, [signinUser]);

    queryStr = `FLUSH PRIVILEGES`;
    await this.execute(queryStr, []);

    // 因為跟其他函式結構不同，這邊在成功後 return true
    // 失敗理應會由 this.execute() throw error
    return true;
  }

  // 一般權限即可執行，所以正常組裝指令即可
  async create(userId: string, obj: CreateObj) {
    const { dbName, table, columns } = obj;
    const columnsClauses: string[] = [];

    let queryStr = `CREATE TABLE \`${dbName}\`.\`${table}\` (`;

    for (const column of columns) {
      if (column.name !== "PRIMARY KEY") {
        columnsClauses.push(
          `\`${column.name}\` ${column.type} ${column.options?.join(" ") || ""}`
        );
      } else {
        // 目前為 PK 專屬
        columnsClauses.push(column.type);
      }
    }

    queryStr += columnsClauses.join(", ");
    queryStr += ")";

    console.log(queryStr, []);
    await this.execute(queryStr, []);

    await addHistory(userId, "Create Table", queryStr, []);

    return true;
  }
}

export default CreateUtility;
