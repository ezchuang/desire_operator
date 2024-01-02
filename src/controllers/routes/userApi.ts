import express, { Request, Response, IRouter } from "express";
import {
  CreateUserObj,
  getUserDbObj,
  UserPayload,
} from "../../models/base/Interfaces";
import UserUtility from "../../models/utility/UserUtility";
import rootDb from "../../models/dbConstructor/rootDb";
import guestDb from "../../models/dbConstructor/guestDb";
import jwt from "jsonwebtoken";

const Snowflake = require("snowflake-id").default;
const generator = new Snowflake({ mid: 2 });

export default async function userApiInit() {
  const userApi: IRouter = express.Router();

  const rootUtility = new UserUtility(rootDb);

  // 創建使用者
  userApi.post("/user", async (req: Request, res: Response) => {
    // #swagger.tags = ["User"]
    // #swagger.description = "Endpoint for user creation."

    try {
      const params: CreateUserObj = {
        userMail: req.body.email,
        userPw: req.body.password,
        userName: req.body.name,
        invitationCode: req.body.invitationCode,
        groupName: req.body.invitationCode ? null : req.body.newGroupName, // 邀請碼優先
      };

      if (!params.userMail || !params.userPw || !params.userName) {
        throw new Error("ValidationError");
      }

      if (!params.invitationCode && !params.groupName) {
        throw new Error("ValidationError");
      }

      if (await rootUtility.checkExist(params)) {
        throw new Error("DuplicateEmail");
      }

      const result = await rootUtility.createUser(params);
      if (!result) {
        throw new Error("DuplicateEmail");
      }

      res.status(200).json({ success: true });
    } catch (error) {
      let msg = "";
      if (error instanceof Error) {
        switch (error.message) {
          case "ValidationError":
            msg = "請輸入完整資料";
            break;

          case "DuplicateEmail":
            msg = "event-mail 重複申請";
            break;

          case "InvitationCodeDoesNotExist":
            msg = "邀請碼不存在";
            break;

          case "DuplicateGroupName":
            msg = "群組名稱重複";
            break;

          default:
            return res
              .status(500)
              .json({ error: true, message: "伺服器內部錯誤" });
        }
      } else {
        console.error("Unexpected error", error);
        return res.status(500).json({ error: true, message: "未知錯誤" });
      }
      return res.status(400).json({ error: true, message: msg });
    }
  });

  // 登入
  userApi.put("/user/auth", async (req: Request, res: Response) => {
    // #swagger.tags = ["User"]
    // #swagger.description = "Endpoint for user authentication."

    try {
      const params: getUserDbObj = {
        userMail: req.body.email,
        userPw: req.body.password,
      };

      if (!(params.userMail && params.userPw)) {
        throw new Error("MissingCredentials");
      }

      // 撈出 [使用者編號, 使用者暱稱]
      const userInfo = await rootUtility.getUserInfo(params);
      if (!userInfo || userInfo.length <= 0) {
        throw new Error("InvalidCredentials");
      }

      // 撈出 [使用者群組, 群組DB]
      const [groupName, dbUser, invitationCode, groupDb] =
        await rootUtility.getUserDb(params);
      // 群組與資料庫連接池的映射，[群組登入者, 群組DB]
      global.groupDbMap.set(dbUser, groupDb);
      // 群組與資料庫連接池的映射，[使用者編號, 群組登入者]
      global.userGroupMap.set(userInfo[0], dbUser);

      const token = jwt.sign(
        {
          userId: userInfo[0],
          userEmail: params.userMail,
          userName: userInfo[1],
          dbUser: dbUser, // 取得 DB 映射用，不呈現在一般資料中
          invitationCode: invitationCode,
          groupName: groupName,
        },
        global.privateKey,
        { algorithm: "RS256", expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        data: {
          token: token,
          userName: userInfo[1],
          groupName: groupName,
          invitationCode: invitationCode,
        },
      });
    } catch (err: any) {
      let msg = "";
      if (err) {
        if ("sqlMessage" in err) {
          return res.status(400).json({ error: true, message: err.sqlMessage });
        }

        switch (err.message) {
          case "MissingCredentials":
            msg = "資料未填寫";
            break;

          case "InvalidCredentials":
            msg = "email或密碼錯誤";
            break;

          default:
            console.error(err);
            return res.status(500).json({ error: true, message: "伺服器錯誤" });
        }
      }
      return res.status(400).json({ error: true, message: msg });
    }
  });

  // 已登入驗證
  userApi.get("/user/auth", async (req: Request, res: Response) => {
    // #swagger.tags = ["User"]
    // #swagger.description = "Endpoint for verifying user authentication."
    // #swagger.security = [{ "bearerAuth": [] }]

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("NoTokenProvided");
      }

      const decoded = jwt.verify(token, global.publicKey, {
        algorithms: ["RS256"],
      }) as UserPayload;

      req.user = decoded;
      console.log("decoded: ", decoded);

      // Guest 路徑
      if (req.user.isGuest) {
        const resData = {
          userName: req.user.userName,
          groupName: "Guest",
          invitationCode: "None",
        };

        return res.status(200).json({ success: true, data: resData });
      }

      // 標準路徑
      // 撈 userGroup(dbUser)
      const userGroup = global.userGroupMap.get(req.user!.userId) as string;

      // 若是伺服器有重啟，就需要走這裡，由 Token 建立 DB Connection
      if (!userGroup) {
        const [dbUser, groupDb] = await rootUtility.getUserDbByToken({
          userId: req.user.userId,
          userMail: req.user.userEmail,
          dbUser: req.user.dbUser,
        });
        global.groupDbMap.set(dbUser, groupDb);
        global.userGroupMap.set(req.user.userId, dbUser);
      }

      const resData = {
        userName: req.user.userName,
        groupName: req.user.groupName,
        invitationCode: req.user.invitationCode,
      };

      return res.status(200).json({ success: true, data: resData });
    } catch (err: any) {
      let msg = "";
      if (err) {
        if ("sqlMessage" in err) {
          return res.status(400).json({ error: true, message: err.sqlMessage });
        }

        switch (err.message) {
          case "NoTokenProvided":
            msg = "No token provided";
            break;

          case "jwt expired":
            msg = "JWT expired";
            break;

          default:
            console.error(err);
            return res.status(500).json({ error: true, message: "伺服器錯誤" });
        }
      }
      return res.status(401).json({ error: true, message: msg });
    }
  });

  // 登入
  userApi.put("/user/guestAuth", async (req: Request, res: Response) => {
    // #swagger.tags = ["User"]
    // #swagger.description = "Endpoint for guest user authentication."

    try {
      const params: getUserDbObj = {
        userMail: req.body.account, // 減少更動區域，此項無直接作用
        dbUser: req.body.account, // 減少更動區域，將 account 轉至 dbUser 使用
        userPw: req.body.password,
        host: req.body.dbHost,
      };
      console.log(params);

      if (!(params.userMail && params.userPw && params.host)) {
        throw new Error("MissingCredentials");
      }

      // 撈出 [使用者編號, 使用者暱稱]
      const userId = `G${String(generator.generate())}`; // G 開頭做標示
      const userName = req.body.userName;

      let guestDbInstance;
      try {
        guestDbInstance = guestDb(params.dbUser!, params.userPw, params.host);
      } catch (err) {
        console.log(err);
        throw new Error("InvalidCredentials");
      }
      // 群組與資料庫連接池的映射，[群組登入者, 群組DB]
      // Guest dbUser 改以雪花 ID 生成，並加上 "D" 前墜
      const dbUser = `D${String(generator.generate())}`; // D 開頭做標示
      global.groupDbMap.set(dbUser, guestDbInstance);
      // 群組與資料庫連接池的映射，[使用者編號, 群組登入者]
      global.userGroupMap.set(userId, dbUser);

      const token = jwt.sign(
        {
          userId: userId,
          userEmail: params.userMail,
          userName: userName,
          dbUser: params.dbUser!, // 取得 DB 映射用，不呈現在一般資料中
          invitationCode: "None",
          groupName: "Guest",
          isGuest: true, // Guest 標記
        },
        global.privateKey,
        { algorithm: "RS256", expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        data: {
          token: token,
          userName: userName,
          groupName: "Guest",
          invitationCode: "None",
        },
      });
    } catch (err: any) {
      let msg = "";
      if (err) {
        if ("sqlMessage" in err) {
          return res.status(400).json({ error: true, message: err.sqlMessage });
        }

        switch (err.message) {
          case "MissingCredentials":
            msg = "資料未填寫";
            break;

          case "InvalidCredentials":
            msg = "資料庫連接失敗，可能是帳號或密碼錯誤";
            break;

          default:
            console.error(err);
            return res.status(500).json({ error: true, message: "伺服器錯誤" });
        }
      }
      return res.status(400).json({ error: true, message: msg });
    }
  });

  return userApi;
}
