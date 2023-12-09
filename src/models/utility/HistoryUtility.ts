import DbUtilityBase from "./DbUtilityBase";
import { HistoryRecord } from "models/base/Interfaces";

class HistoryUtility extends DbUtilityBase {
  // 新增歷史記錄
  async addHistoryRecord(record: HistoryRecord) {
    try {
      const { id, actionType, queryHistory } = record;
      const values = [id, actionType, queryHistory];

      const queryStr = `INSERT INTO user_info.query_history (user_id, action_type, query_history) VALUES (?, ?, ?)`;

      console.log(queryStr, values);
      await this.execute(queryStr, values);

      return true;
    } catch (error) {
      console.error("Error adding history record:", error);
    }
  }

  // 根據用戶的群組 ID 獲取歷史記錄
  async getHistoryByGroupId(groupName: string): Promise<HistoryRecord[]> {
    // CONVERT_TZ(query_history.timestamp_data, '+00:00', 'Asia/Taipei') AS timestamp,    <- 此列從 Select 移除，將時區轉換移至前端
    const queryStr = `
        SELECT
            query_history.action_type AS action,
            query_history.query_history AS query,
            query_history.timestamp_data AS timestamp,
            users.user_name AS name
        FROM
          user_info.query_history
        JOIN
          user_info.users ON query_history.user_id = users.id
        JOIN
          user_info.user_groups_to_users ON users.id = user_groups_to_users.users_id
        JOIN
          user_info.user_groups ON user_groups_to_users.user_groups_id = user_groups.id
        WHERE
          user_groups.signin_user = ?
        ORDER BY
          query_history.id DESC
        LIMIT 100;
      `;

    // console.log(queryStr, [groupName]);
    return await this.execute(queryStr, [groupName]);
  }
}

export default HistoryUtility;
