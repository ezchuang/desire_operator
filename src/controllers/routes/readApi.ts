import express, { Request, Response, IRouter } from "express";
import {
  ReadDbsAndTablesObj,
  ReadObj,
} from "../../models/base/QueryObjInterfaces";
// import rootDb from "../../models/getDb/rootDb";
// import userDb from "../../models/DbConstructor/userDb";
import ReadUtility from "../../models/utility/ReadUtility";
import dataClean from "../../controllers/dataClean";
import verifyToken from "../../controllers/verifyToken";

export default async function readApiInit() {
  const readApi: IRouter = express.Router();

  /* 寫一個 middleware 驗證使用者 */
  /* 多寫一個 model 用來檢測使用者 */

  readApi.post(
    "/readDbsAndTables",
    verifyToken,
    async (req: Request, res: Response) => {
      console.log("readDbsAndTables");
      try {
        const readUtility = new ReadUtility(req.db);

        const params: ReadDbsAndTablesObj = {
          dbName: req.body.dbName,
        };
        const [data, structure] = await readUtility.readDBsAndTables(params);

        // console.log(data);
        // console.log(structure);

        return res.status(200).json({ data: data, structure: structure });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
      }
    }
  );

  readApi.post(
    "/readData",
    verifyToken,
    async (req: Request, res: Response) => {
      console.log("readData");
      try {
        const readUtility = new ReadUtility(req.db);

        const params: ReadObj = {
          dbName: req.body.dbName,
          table: req.body.table,
          select: req.body.select,
          where: req.body.where,
          groupBy: req.body.groupBy,
          orderBy: req.body.orderBy,
          orderDirection: req.body.orderDirection,
          limit: req.body.limit,
        };
        const [data, structure] = await readUtility.read(params);

        const dataType = (await readUtility.readTableStructures(params))[0];

        const cleanedStructure = dataClean(structure, dataType);

        return res
          .status(200)
          .json({ data: data, structure: cleanedStructure });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
      }
    }
  );
  return readApi;
}
