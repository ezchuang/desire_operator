import * as dotenv from "dotenv";
import DbUtilityBase from "./DbUtilityBase";
import {
  CreateUserObj,
  getUserDbObj,
  DatabaseConfigObj,
} from "models/base/Interfaces";
import Database from "../dbConstructor/Database";

const Snowflake = require("snowflake-id").default;
const generator = new Snowflake({ mid: 1 });

dotenv.config();

// const mySqlSever = process.env.USERDB_HOST!; // 應該用不到，我當初設計有點誤解

class UserUtility extends DbUtilityBase {
  // 針對帳密加密儲存，尚未設計
  private async hashUserInfo(
    username: string,
    password: string
  ): Promise<string[]> {
    const un = "a999a" + username;
    const pw = "a999a" + password;
    return [un, pw];
  }

  // 新群組用的自動生成邀請碼
  private createInvitationCode(): string {
    const snowflakeId = String(generator.generate());
    return snowflakeId;
  }

  // 建立 MySQL 的使用者
  private async createMySQLUser(username: string, password: string) {
    // let queryStr = `CREATE USER ?@? IDENTIFIED BY ?`;
    // await this.execute(queryStr, [username, mySqlSever, password]);
    let queryStr = `CREATE USER ?@\`%\` IDENTIFIED BY ?`;
    await this.execute(queryStr, [username, password]);
  }

  // 主要的 創建使用者 函式
  async createUser(userObj: CreateUserObj) {
    const { userMail, userPw, userName, invitationCode, groupName } = userObj;

    const insertUserQuery = `
      INSERT INTO 
        user_info.users (user_mail, user_pw, user_name) 
      VALUES 
        (?, ?, ?)`;
    await this.execute(insertUserQuery, [userMail, userPw, userName]);

    const getUserIdQuery = `SELECT id FROM user_info.users WHERE user_mail = ? AND user_pw = ?`;
    const userId = (
      await this.execute(getUserIdQuery, [userMail, userPw])
    )[0][0].id;

    if (invitationCode) {
      // 加入既有 Group
      const getGroupIdQuery = `SELECT id FROM user_info.user_groups WHERE invitation_code=?`;
      const groupId = (
        await this.execute(getGroupIdQuery, [invitationCode])
      )[0][0].id;

      // verify 有機會再回頭加
      const insertGroupQuery = `
        INSERT INTO 
          user_info.user_groups_to_users (user_groups_id, users_id, verify) 
        VALUES 
          (?, ?, ?)`;
      await this.execute(insertGroupQuery, [groupId, userId, 1]);
    } else if (groupName) {
      // 建立新的 Group
      const newInvitationCode = this.createInvitationCode();

      // 加密使用者帳密用作 Group 登入用
      const [groupUserName, groupPw] = await this.hashUserInfo(
        userMail,
        userPw
      );

      const insertGroupQuery = `
        INSERT INTO 
          user_info.user_groups (group_name, owner_mail, signin_user, signin_pw, invitation_code) 
        VALUES 
          (?, ?, ?, ?, ?)`;
      await this.execute(insertGroupQuery, [
        groupName,
        userMail,
        groupUserName,
        groupPw,
        newInvitationCode,
      ]);

      const getGroupIdQuery = `SELECT id FROM user_info.user_groups WHERE invitation_code = ?`;
      const groupId = (
        await this.execute(getGroupIdQuery, [newInvitationCode])
      )[0][0].id;

      const insertGToUQuery = `
        INSERT INTO 
          user_info.user_groups_to_users (user_groups_id, users_id, verify) 
        VALUES 
          (?, ?, ?)`;
      await this.execute(insertGToUQuery, [groupId, userId, 1]);

      await this.createMySQLUser(groupUserName, groupPw);
    } else {
      // 記得回來加
      throw new Error("資料異常");
    }

    return {
      success: true,
      message: "User and MySQL access created successfully.",
    };
  }

  // 取得既有 DB 連線(不是直接回傳 Pool)
  async getUserDb(
    userObj: getUserDbObj
  ): Promise<[string, string, string, Database]> {
    const { userMail, userPw } = userObj;
    const getUserDbQuery = `
      SELECT 
        user_groups.group_name AS groupName,
        user_groups.signin_user AS dbUser,
        user_groups.signin_pw AS dbPw,
        user_groups.invitation_code AS invitationCode
      FROM 
        user_info.user_groups 
      LEFT JOIN 
        user_info.user_groups_to_users ON user_groups.id = user_groups_to_users.user_groups_id
      LEFT JOIN 
        user_info.users ON users.id = user_groups_to_users.users_id
      WHERE 
        users.user_mail = ? AND users.user_pw = ?`;
    const { groupName, dbUser, dbPw, invitationCode } = (
      await this.execute(getUserDbQuery, [userMail, userPw])
    )[0][0];

    if (globalThis.groupDbMap.has(groupName)) {
      return [
        groupName,
        dbUser,
        invitationCode,
        globalThis.groupDbMap.get(groupName),
      ];
    }

    // 沒建立過該群組的 DB
    const config: DatabaseConfigObj = {
      user: dbUser,
      password: dbPw,
      host: process.env.USERDB_HOST!,
    };
    const groupDb = new Database(config);

    return [groupName, dbUser, invitationCode, groupDb];
  }

  // 取得使用者資料
  async getUserInfo(userObj: getUserDbObj): Promise<string[]> {
    const { userMail, userPw } = userObj;
    const getUserInfoQuery = `
      SELECT 
        users.id AS userId, 
        users.user_name AS userName 
      FROM 
        user_info.users 
      WHERE 
        users.user_mail = ? AND users.user_pw = ?`;
    const results = await this.execute(getUserInfoQuery, [userMail, userPw]);

    if (results.length > 0 && results[0].length > 0) {
      const { userId, userName } = results[0][0];
      console.log("userId, userName: ", userId, userName);
      return [userId, userName];
    } else {
      // throw new Error('User not found.');
      return [];
    }
  }

  // 在有 Token 的情況下使用
  async getUserDbByToken(userObj: getUserDbObj): Promise<[string, Database]> {
    const { userId, userMail, dbUser } = userObj;
    const getUserDbQuery = `
      SELECT 
        user_groups.group_name AS groupName,
        user_groups.signin_pw AS dbPw,
      FROM 
        user_info.user_groups 
      LEFT JOIN 
        user_info.user_groups_to_users ON user_groups.id = user_groups_to_users.user_groups_id
      LEFT JOIN 
        user_info.users ON users.id = user_groups_to_users.users_id
      WHERE 
        users.id = ? AND users.user_mail = ? AND user_groups.signin_user = ?`;
    const { groupName, dbPw } = (
      await this.execute(getUserDbQuery, [userId, userMail, dbUser])
    )[0][0];

    if (globalThis.groupDbMap.has(groupName)) {
      return [groupName, globalThis.groupDbMap.get(groupName)];
    }

    // 沒建立過該群組的 DB instance
    const config: DatabaseConfigObj = {
      user: dbUser!,
      password: dbPw,
      host: process.env.USERDB_HOST!,
    };
    const groupDb = new Database(config);

    return [groupName, groupDb];
  }

  // 建立 User 前先檢查是否既存
  async checkExist(userObj: CreateUserObj) {
    const { userMail } = userObj;

    const queryStr = `SELECT user_mail FROM user_info.users WHERE user_mail = ?`;

    if ((await this.execute(queryStr, [userMail]))[0].length < 0) {
      return false;
    }

    return true;
  }
}

export default UserUtility;
