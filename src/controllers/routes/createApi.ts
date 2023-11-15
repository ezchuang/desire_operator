import express, { Request, Response, IRouter } from "express";
import { CreateDbObj, CreateObj } from "../../models/base/QueryObjInterfaces";
import rootDb from "../../models/DbConstructor/rootDb";
import userDb from "../../models/DbConstructor/userDb";
import CreateUtility from "../../models/utility/CreateUtility";

export default async function createApiInit() {
  const createApi: IRouter = express.Router();

  const rootCreateUtility = new CreateUtility(rootDb);
  const userCreateUtility = new CreateUtility(await userDb);

  /* 寫一個 middleware 驗證使用者 */
  /* 多寫一個 model 用來檢測使用者 */

  createApi.post("/createDb", async (req: Request, res: Response) => {
    try {
      /* 做 token 轉換後，未完成 */
      const userID = req.body.creatorUsername;

      const params: CreateDbObj = {
        dbName: req.body.dbName,
        creatorUsername: userID,
      };
      const data = await rootCreateUtility.createDb(params); // true or error

      return res.status(200).json({ data: data });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });

  createApi.post("/createTable", async (req: Request, res: Response) => {
    try {
      const params: CreateObj = {
        dbName: req.body.dbName,
        table: req.body.table,
        columns: req.body.columns,
      };
      const data = await userCreateUtility.create(params);

      return res.status(200).json({ data: data });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });

  return createApi;
}
