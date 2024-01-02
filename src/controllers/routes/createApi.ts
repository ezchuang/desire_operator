import express, { Request, Response, IRouter } from "express";
import { CreateDbObj, CreateObj } from "../../models/base/Interfaces";
import rootDb from "../../models/dbConstructor/rootDb";
import CreateUtility from "../../models/utility/CreateUtility";
import verifyToken from "../../controllers/verifyToken";

export default async function createApiInit() {
  const createApi: IRouter = express.Router();

  createApi.use(verifyToken);

  const rootCreateUtility = new CreateUtility(rootDb);

  // 建立 Database
  createApi.post("/database", async (req: Request, res: Response) => {
    // #swagger.tags = ["Create"]
    // #swagger.description = "Endpoint for creating a database."

    try {
      const dbUser = req.userGroup;
      const userId = req.user!.userId;

      const params: CreateDbObj = {
        dbName: req.body.dbName,
        groupSigninUser: dbUser,
      };

      let data;
      if (req.user!.isGuest) {
        const guestCreateUtility = new CreateUtility(req.db);
        data = await guestCreateUtility.createDb(userId, params);
      } else {
        data = await rootCreateUtility.createDb(userId, params);
      }

      return res.status(200).json({ data: data }); // data: true or error
    } catch (err: any) {
      console.error("Error in createDb: ", err);

      if ("sqlMessage" in err) {
        return res.status(400).json({ error: true, message: err.sqlMessage });
      }
      return res.status(500).json({ error: true, message: err });
    }
  });

  // 建立 Table
  createApi.post("/table", async (req: Request, res: Response) => {
    // #swagger.tags = ["Create"]
    // #swagger.description = "Endpoint for creating a table."

    try {
      const userCreateUtility = new CreateUtility(req.db);
      const userId = req.user!.userId;

      const params: CreateObj = {
        dbName: req.body.dbName,
        table: req.body.table,
        columns: req.body.columns,
      };
      const data = await userCreateUtility.create(userId, params);

      return res.status(200).json({ data: data });
    } catch (err: any) {
      console.error("Error in createTable: ", err);

      if ("sqlMessage" in err) {
        return res.status(400).json({ error: true, message: err.sqlMessage });
      }
      return res.status(500).json({ error: true, message: err });
    }
  });

  return createApi;
}
