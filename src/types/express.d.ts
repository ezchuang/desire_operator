/* eslint-disable no-unused-vars */
import { JwtPayload } from "jsonwebtoken";
import Database from "../../models/DbConstructor/Database";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      db?: Database;
      userGroup: string;
    }
  }
}

export {};
