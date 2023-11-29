import * as dotenv from "dotenv";
import Database from "./Database";
import { DatabaseConfigObj } from "../base/Interfaces";

dotenv.config();

const permissionsConfig: DatabaseConfigObj = {
  user: process.env.USERDB_ADMIN!,
  password: process.env.USERDB_PW!,
  host: process.env.USERDB_HOST!,
};

const permissionsDb = new Database(permissionsConfig);

export default permissionsDb;
