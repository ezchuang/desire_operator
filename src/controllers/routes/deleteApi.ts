import express, { Request, Response, IRouter } from "express";
import { DeleteObj } from "../../models/base/Interfaces";
import DeleteUtility from "../../models/utility/DeleteUtility";
import verifyToken from "../../controllers/verifyToken";

export default async function deleteApiInit() {
  const deleteApi: IRouter = express.Router();

  // 刪除 Database
  deleteApi.delete(
    "/deleteDatabase",
    verifyToken,
    async (req: Request, res: Response) => {
      try {
        const deleteUtility = new DeleteUtility(req.db);
        const userId = req.user!.userId;

        const params: DeleteObj = {
          dbName: req.body.dbName,
        };
        const data = await deleteUtility.dropDatabase(userId, params);

        return res.status(200).json({ data: data });
      } catch (err: any) {
        console.error("Error in deleteDatabase: ", err);

        if ("sqlMessage" in err) {
          return res.status(400).json({ error: true, message: err.sqlMessage });
        }
        return res.status(500).json({ error: true, message: err });
      }
    }
  );

  // 刪除 Table
  deleteApi.delete(
    "/deleteTable",
    verifyToken,
    async (req: Request, res: Response) => {
      try {
        const deleteUtility = new DeleteUtility(req.db);
        const userId = req.user!.userId;

        const params: DeleteObj = {
          dbName: req.body.dbName,
          table: req.body.table,
        };
        const data = await deleteUtility.dropTable(userId, params);

        return res.status(200).json({ data: data });
      } catch (err: any) {
        console.error("Error in deleteTable: ", err);

        if ("sqlMessage" in err) {
          return res.status(400).json({ error: true, message: err.sqlMessage });
        }
        return res.status(500).json({ error: true, message: err });
      }
    }
  );

  // 刪除資料
  deleteApi.delete(
    "/deleteData",
    verifyToken,
    async (req: Request, res: Response) => {
      console.log("deleteData");

      try {
        const deleteUtility = new DeleteUtility(req.db);
        const userId = req.user!.userId;

        const params: DeleteObj = {
          dbName: req.body.dbName,
          table: req.body.table,
          where: req.body.where, // 若不需要此值，前端須給空 Array
        };
        const data = await deleteUtility.delete(userId, params);

        return res.status(200).json({ data: data });
      } catch (err: any) {
        console.error("Error in deleteData: ", err);

        if ("sqlMessage" in err) {
          return res.status(400).json({ error: true, message: err.sqlMessage });
        }
        return res.status(500).json({ error: true, message: err });
      }
    }
  );

  return deleteApi;
}
