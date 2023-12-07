import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import rootDb from "../models/dbConstructor/rootDb";
import UserUtility from "../models/utility/UserUtility";

const rootUtility = new UserUtility(rootDb);

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, global.publicKey, {
      algorithms: ["RS256"],
    }) as jwt.JwtPayload;
    req.user = decoded;

    if (req.user.isGuest) {
      // 建一個 boolean 紀錄是否是 Guest

      // 是否撈的到 userGroup(dbUser)，撈不到則丟出 Error 到 無效 Token
      let userGroup = global.userGroupMap.get(req.user!.userId) as string;
      if (!userGroup) {
        throw new jwt.JsonWebTokenError("Invalid token or user group");
      }

      req.userGroup = userGroup; // group access account
      req.db = global.groupDbMap.get(userGroup);

      next();
      return;
    }

    // 撈 userGroup(dbUser)
    let userGroup = global.userGroupMap.get(req.user!.userId) as string;

    // 若是伺服器有重啟，就需要走這裡，由 Token 建立 DB Connection
    if (!userGroup) {
      const [dbUser, groupDb] = await rootUtility.getUserDbByToken({
        userId: req.user.userId,
        userMail: req.user.userEmail,
        dbUser: req.user.dbUser,
      });
      global.groupDbMap.set(dbUser, groupDb);
      global.userGroupMap.set(req.user.userId, dbUser);
      userGroup = dbUser;
    }

    req.userGroup = userGroup;
    req.db = global.groupDbMap.get(userGroup);

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "無效 Token" });
    }
    console.error(error);
    return res.status(500).json({ error: "伺服器錯誤" });
  }
};

export default verifyToken;
