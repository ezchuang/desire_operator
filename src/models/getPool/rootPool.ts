import Database from "../../models/base/Database";
import { DatabaseConfigObj } from "../../models/interfaces/QueryObjInterfaces";

const rootConfig: DatabaseConfigObj = {
  user: process.env.DB_ADMIN!,
  password: process.env.DB_PW!,
  host: process.env.DB_HOST!,
};

const rootPool = new Database(rootConfig).getPool();

export default rootPool;
