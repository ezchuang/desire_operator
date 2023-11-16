import * as dotenv from "dotenv";
import DbUtilityBase from "./DbUtilityBase";
import { CreateUserObj, getUserDbObj } from "models/base/QueryObjInterfaces";
import Database from "../DbConstructor/Database";
import { DatabaseConfigObj } from "models/base/QueryObjInterfaces";

const Snowflake = require("snowflake-id").default;
const generator = new Snowflake({ mid: 1 });

dotenv.config();

const mySqlSever = process.env.USERDB_HOST!;

class UserUtility extends DbUtilityBase {
  private async hashUserInfo(
    username: string,
    password: string
  ): Promise<string[]> {
    // 加密邏輯
    const un = username;
    const pw = password;
    return [un, pw];
  }

  private createInvitationCode(): string {
    const snowflakeId = String(generator.generate());
    return snowflakeId;
  }

  private async createMySQLUser(username: string, password: string) {
    let queryStr = `CREATE USER ?@? IDENTIFIED BY ?`;
    await this.execute(queryStr, [username, mySqlSever, password]);
  }

  async createUser(userObj: CreateUserObj) {
    const { userMail, userPw, userName, invitationCode, groupName } = userObj;

    const [groupUserName, groupPw] = await this.hashUserInfo(userMail, userPw);

    const insertUserQuery = `INSERT INTO user_info.users (user_mail, user_pw, user_name) VALUES (?, ?, ?)`;
    await this.execute(insertUserQuery, [userMail, userPw, userName]);

    const getUserIdQuery = `SELECT id FROM user_info.users WHERE user_mail=? AND user_pw=?`;
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
      const insertGroupQuery = `INSERT INTO user_info.user_groups (group_table_id, user_table_id, verify) VALUES (?, ?, ?)`;
      await this.execute(insertGroupQuery, [groupId, userId, 1]);
    } else if (groupName) {
      // 建立新的 Group
      const newInvitationCode = this.createInvitationCode();

      const insertGroupQuery = `INSERT INTO user_info.user_groups (group_name, owner_mail, signin_user, signin_pw, invitation_code) VALUES (?, ?, ?, ?, ?)`;
      await this.execute(insertGroupQuery, [
        groupName,
        userMail,
        groupUserName,
        groupPw,
        newInvitationCode,
      ]);

      const getGroupIdQuery = `SELECT id FROM user_info.user_groups WHERE invitation_code=?`;
      const groupId = (
        await this.execute(getGroupIdQuery, [newInvitationCode])
      )[0][0].id;

      const insertGToUQuery = `INSERT INTO user_info.user_groups_to_users (group_table_id, user_table_id, verify) VALUES (?, ?, ?)`;
      await this.execute(insertGToUQuery, [groupId, userId, 1]);
    } else {
      // 記得回來加
      throw new Error("帳密錯誤");
    }

    await this.createMySQLUser(groupUserName, groupPw);

    return {
      success: true,
      message: "User and MySQL access created successfully.",
    };
  }

  async getUserDb(userObj: getUserDbObj): Promise<Database> {
    const { userMail, userPw } = userObj;
    const getUserInfoQuery =
      "SELECT user_groups.signin_user AS dbUser, user_groups.signin_pw AS dbPw\
      FROM user_info.user_groups LEFT JOIN user_info.user_groups_to_users ON user_groups.id = user_groups_to_users.user_groups_id \
      LEFT JOIN user_info.users ON users.id = user_groups_to_users.users_id \
      WHERE users.user_mail = ? AND users.user_pw = ?";
    const { dbUser, dbPw } = (
      await this.execute(getUserInfoQuery, [userMail, userPw])
    )[0][0];
    const config: DatabaseConfigObj = {
      user: dbUser,
      password: dbPw,
    };
    const userDb = new Database(config);
    return userDb;
  }

  async getUserInfo(userObj: getUserDbObj): Promise<string[]> {
    const { userMail, userPw } = userObj;
    const getUserInfoQuery =
      "SELECT users.id AS userId users.user_name AS userName FROM user_info.users WHERE users.user_mail = ? AND users.user_pw = ?";
    const { userId, userName } = (
      await this.execute(getUserInfoQuery, [userMail, userPw])
    )[0][0];
    return [userId, userName];
  }
}

export default UserUtility;
