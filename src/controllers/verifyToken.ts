import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// export interface RequestWithUser extends Request {
//   user: jwt.JwtPayload;
// }

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, global.secretKey) as jwt.JwtPayload;
    // 這段有點邪
    // (req as any).user = decoded;
    // req.user = decoded;
    req.user = decoded;

    const userGroup = globalThis.userGroupMap.get(req.user!.userId) as string;
    const groupDb = globalThis.groupDbMap.get(userGroup);

    req.db = groupDb;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "無效 Token" });
    }
    return res.status(500).json({ error: "伺服器錯誤" });
  }
};

export default verifyToken;
