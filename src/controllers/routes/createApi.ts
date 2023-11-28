import express, { Request, Response, IRouter } from "express";
import { CreateDbObj, CreateObj } from "../../models/base/Interfaces";
import rootDb from "../../models/dbConstructor/rootDb";
import CreateUtility from "../../models/utility/CreateUtility";
import verifyToken from "../../controllers/verifyToken";

export default async function createApiInit() {
  const createApi: IRouter = express.Router();

  const rootCreateUtility = new CreateUtility(rootDb);

  createApi.post(
    "/createDb",
    verifyToken,
    async (req: Request, res: Response) => {
      console.log("createDb");
      try {
        const userGroup = req.userGroup;

        const params: CreateDbObj = {
          dbName: req.body.dbName,
          groupName: userGroup,
        };
        const data = await rootCreateUtility.createDb(params);

        return res.status(200).json({ data: data }); // data: true or error
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
