import * as dotenv from "dotenv";
import Database from "./Database";
import { DatabaseConfigObj } from "../base/QueryObjInterfaces";

dotenv.config();

const rootConfig: DatabaseConfigObj = {
  user: process.env.USERDB_ADMIN!,
  password: process.env.USERDB_PW!,
  host: process.env.USERDB_HOST!,
};

const rootDb = new Database(rootConfig);

export default rootDb;
