import express, { Request, Response, IRouter } from "express";
import { UpdateObj } from "../../models/base/QueryObjInterfaces";
// import rootDb from "../../models/getDb/rootDb";
// import userDb from "../../models/DbConstructor/userDb";
import verifyToken from "../../controllers/verifyToken";
import UpdateUtility from "../../models/utility/UpdateUtility";

export default async function updateApiInit() {
  const updateApi: IRouter = express.Router();

  // const updateUtility = new UpdateUtility(await userDb);

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

        return res.status(200).json({ data: data[0].info });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    }
  );

  return updateApi;
}
