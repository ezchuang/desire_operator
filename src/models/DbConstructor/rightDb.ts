import * as dotenv from "dotenv";
import Database from "./Database";
import { DatabaseConfigObj } from "../base/QueryObjInterfaces";

dotenv.config();

const userConfig: DatabaseConfigObj = {
  user: process.env.USERDB_ADMIN!,
  password: process.env.USERDB_PW!,
  host: process.env.USERDB_HOST!,
};

const rightDb = new Database(userConfig);

export default rightDb;
