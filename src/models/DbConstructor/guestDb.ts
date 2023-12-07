import Database from "./Database";
import { DatabaseConfigObj } from "../base/Interfaces";

const guestDb = (user: string, password: string, host: string) => {
  const guestDbConfig: DatabaseConfigObj = {
    user,
    password,
    host,
  };

  return new Database(guestDbConfig);
};

export default guestDb;
