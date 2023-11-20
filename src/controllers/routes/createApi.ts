import express, { Request, Response, IRouter } from "express";
import { CreateDbObj, CreateObj } from "../../models/base/QueryObjInterfaces";
import rootDb from "../../models/dbConstructor/rootDb";
import CreateUtility from "../../models/utility/CreateUtility";
import verifyToken from "../../controllers/verifyToken";

export default async function createApiInit() {
  const createApi: IRouter = express.Router();

  const rootCreateUtility = new CreateUtility(rootDb);
  // const userCreateUtility = new CreateUtility(await userDb);

  /* 寫一個 middleware 驗證使用者 */
  /* 多寫一個 model 用來檢測使用者 */

  createApi.post(
    "/createDb",
    verifyToken,
    async (req: Request, res: Response) => {
      console.log("createDb");
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
    }
  );

  createApi.post(
    "/createTable",
    verifyToken,
    async (req: Request, res: Response) => {
      console.log("createTable");
      try {
        const userCreateUtility = new CreateUtility(req.db);

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
    }
  );

  return createApi;
}
