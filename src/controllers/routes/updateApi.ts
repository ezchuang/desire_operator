import express, { Request, Response, IRouter } from "express";
import { UpdateObj, InsertObj } from "../../models/base/Interfaces";
import verifyToken from "../../controllers/verifyToken";
import UpdateUtility from "../../models/utility/UpdateUtility";

export default async function updateApiInit() {
  const updateApi: IRouter = express.Router();

  updateApi.post(
    "/updateData",
    verifyToken,
    async (req: Request, res: Response) => {
      console.log("updateData");

      try {
        const updateUtility = new UpdateUtility(req.db);

        const params: UpdateObj = {
          dbName: req.body.dbName,
          table: req.body.table,
          data: req.body.data,
          where: req.body.where,
        };
        const data = await updateUtility.update(params);
        console.log("updateData: ", data);

        return res.status(200).json({ data: data });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    }
  );

  updateApi.post(
    "/insertData",
    verifyToken,
    async (req: Request, res: Response) => {
      console.log("insertData");

      try {
        const insertUtility = new UpdateUtility(req.db);

        const params: InsertObj = {
          dbName: req.body.dbName,
          table: req.body.table,
          data: req.body.values,
        };
        const data = await insertUtility.insert(params);
        console.log("insertData: ", data);

        return res.status(200).json({ data: data });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    }
  );

  return updateApi;
}
