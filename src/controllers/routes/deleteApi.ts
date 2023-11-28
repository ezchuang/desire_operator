import express, { Request, Response, IRouter } from "express";
import { DeleteObj } from "../../models/base/Interfaces";
import DeleteUtility from "../../models/utility/DeleteUtility";
import verifyToken from "../../controllers/verifyToken";

export default async function deleteApiInit() {
  const deleteApi: IRouter = express.Router();

  // 刪除 Database
  deleteApi.post(
    "/deleteDatabase",
    verifyToken,
    async (req: Request, res: Response) => {
      try {
        const deleteUtility = new DeleteUtility(req.db);

        const params: DeleteObj = {
          dbName: req.body.dbName,
        };
        const data = await deleteUtility.dropDatabase(params);

        return res.status(200).json({ data: data });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    }
  );

  // 刪除 Table
  deleteApi.post(
    "/deleteTable",
    verifyToken,
    async (req: Request, res: Response) => {
      try {
        const deleteUtility = new DeleteUtility(req.db);

        const params: DeleteObj = {
          dbName: req.body.dbName,
          table: req.body.table,
        };
        const data = await deleteUtility.dropTable(params);

        return res.status(200).json({ data: data });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    }
  );

  // 刪除資料
  deleteApi.post(
    "/deleteData",
    verifyToken,
    async (req: Request, res: Response) => {
      console.log("deleteData");

      try {
        const deleteUtility = new DeleteUtility(req.db);

        const params: DeleteObj = {
          dbName: req.body.dbName,
          table: req.body.table,
          where: req.body.where, // 若不需要此值，前端須給空 Array
          /* 檢查是否需要在這邊展開 where 內層 */
        };
        const data = await deleteUtility.delete(params);

        return res.status(200).json({ data: data });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    }
  );

  return deleteApi;
}
