import Database from "../../models/base/Database";
import { DatabaseConfigObj } from "../../models/interfaces/QueryObjInterfaces";

const userConfig: DatabaseConfigObj = {
  user: process.env.DB_ADMIN!,
  password: process.env.DB_PW!,
  host: process.env.DB_HOST!,
};

const userPool = new Database(userConfig).getPool();

export default userPool;
