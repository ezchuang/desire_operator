/* eslint-disable no-unused-vars */
import { Database } from "./models/DbConstructor/Database"; // 假設你有一個 Database 類別

declare global {
  var secretKey: string;
  var groupDbMap: Map<string, Database>;
  var userGroupMap: Map<string, string>;
  var privateKey: string;
  var publicKey: string;
}

export {};
