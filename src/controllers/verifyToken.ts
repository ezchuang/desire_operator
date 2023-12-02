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
    const decoded = jwt.verify(token, global.secretKey) as jwt.JwtPayload;
    req.user = decoded;

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
