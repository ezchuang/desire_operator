import express, { Request, Response, IRouter } from "express";
import {
  CreateUserObj,
  getUserDbObj,
  UserPayload,
} from "../../models/base/Interfaces";
import UserUtility from "../../models/utility/UserUtility";
import rootDb from "../../models/dbConstructor/rootDb";
import jwt from "jsonwebtoken";

export default async function userApiInit() {
  const userApi: IRouter = express.Router();

  const rootUtility = new UserUtility(rootDb);

  // 創建使用者
  userApi.post("/createUser", async (req: Request, res: Response) => {
    try {
      const params: CreateUserObj = {
        userMail: req.body.email,
        userPw: req.body.password,
        userName: req.body.name,
        invitationCode: req.body.invitationCode,
        groupName: req.body.newGroupName,
      };

      if (!params.userMail || !params.userPw || !params.userName) {
        throw new Error("ValidationError");
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
            msg = "e-mail 重複申請";
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
      res.status(400).json({ error: true, message: msg });
    }
  });

  // 登入
  userApi.post("/signin", async (req: Request, res: Response) => {
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
      const [groupName, groupDb] = await rootUtility.getUserDb(params);
      global.groupDbMap.set(groupName, groupDb);
      global.userGroupMap.set(userInfo[0], groupName);

      const token = jwt.sign(
        {
          userId: userInfo[0],
          userEmail: params.userMail,
          userName: userInfo[1],
        },
        global.secretKey,
        { expiresIn: "7d" }
      );

      res
        .status(200)
        .json({ success: true, data: { token: token, userName: userInfo[1] } });
    } catch (error) {
      let msg = "";
      if (error instanceof Error) {
        switch (error.message) {
          case "MissingCredentials":
            msg = "資料未填寫";
            break;

          case "InvalidCredentials":
            msg = "email或密碼錯誤";
            break;

          default:
            console.error(error);
            return res.status(500).json({ error: true, message: "伺服器錯誤" });
        }
      }
      res.status(400).json({ error: true, message: msg });
    }
  });

  // 已登入驗證
  userApi.get("/auth", (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("NoTokenProvided");
      }

      const decoded = jwt.verify(token, global.secretKey) as UserPayload;
      const resData = {
        userEmail: decoded.userEmail,
        userId: decoded.userId,
        userName: decoded.userName,
      };
      res.status(200).json({ success: true, data: resData });
    } catch (error) {
      let msg = "";
      if (error instanceof Error) {
        switch (error.message) {
          case "NoTokenProvided":
            msg = "No token provided";
            break;

          case "jwt expired":
            msg = "JWT expired";
            break;

          default:
            console.error(error);
            return res.status(500).json({ error: true, message: "伺服器錯誤" });
        }
      }
      res.status(401).json({ error: true, message: msg });
    }
  });

  return userApi;
}
