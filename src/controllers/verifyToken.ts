import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import rootDb from "../models/dbConstructor/rootDb";
import UserUtility from "../models/utility/UserUtility";

// export interface RequestWithUser extends Request {
//   user: jwt.JwtPayload;
// }
const rootUtility = new UserUtility(rootDb);

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, global.secretKey) as jwt.JwtPayload;
    req.user = decoded;
    console.log(req.user);

    let userGroup = globalThis.userGroupMap.get(req.user!.userId) as string;
    if (!userGroup) {
      const [groupName, groupDb] = await rootUtility.getUserDbByToken(
        req.user.userEmail
      );
      global.groupDbMap.set(groupName, groupDb);
      global.userGroupMap.set(req.user.userId, groupName);
      userGroup = groupName;
      console.log("global.groupDbMap: ", global.groupDbMap);
      console.log("global.userGroupMap: ", global.userGroupMap);
      console.log("groupName: ", groupName);
      console.log("groupDb: ", groupDb);
    }
    const groupDb = globalThis.groupDbMap.get(userGroup);
    req.db = groupDb;

    console.log("db: ", req.db);

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "無效 Token" });
    }
    return res.status(500).json({ error: "伺服器錯誤" });
  }
};

export default verifyToken;
