import express, { Request, Response, IRouter } from "express";
import {
  UpdateObj,
  InsertObj,
  AddColumnObj,
  delColumnObj,
} from "../../models/base/Interfaces";
import verifyToken from "../../controllers/verifyToken";
import UpdateUtility from "../../models/utility/UpdateUtility";

export default async function updateApiInit() {
  const updateApi: IRouter = express.Router();

  // 更新個別資料
  updateApi.put("/data", verifyToken, async (req: Request, res: Response) => {
    console.log("updateData");

    try {
      const updateUtility = new UpdateUtility(req.db);
      const userId = req.user!.userId;

      const params: UpdateObj = {
        dbName: req.body.dbName,
        table: req.body.table,
        data: req.body.data,
        where: req.body.where,
      };
      const data = await updateUtility.update(userId, params);

      return res.status(200).json({ data: data });
    } catch (err: any) {
      console.error("Error in updateData: ", err);

      if ("sqlMessage" in err) {
        return res.status(400).json({ error: true, message: err.sqlMessage });
      }
      return res.status(500).json({ error: true, message: err });
    }
  });

  // 插入新的 Row
  updateApi.post("/data", verifyToken, async (req: Request, res: Response) => {
    console.log("insertData");

    try {
      const [dbName, table, values] = [
        req.body.dbName,
        req.body.table,
        req.body.values,
      ];

      if (!dbName || !table || !values) {
        return res.status(400).json({ error: true, message: "缺少必要的參數" });
      }

      const updateUtility = new UpdateUtility(req.db);
      const userId = req.user!.userId;

      const params: InsertObj = {
        dbName: dbName,
        table: table,
        data: values,
      };
      const data = await updateUtility.insert(userId, params);

      return res.status(200).json({ data: data });
    } catch (err: any) {
      console.error("Error in insertData: ", err);

      if ("sqlMessage" in err) {
        return res.status(400).json({ error: true, message: err.sqlMessage });
      }
      return res.status(500).json({ error: true, message: err });
    }
  });

  // 修改表格加入新的 Column
  updateApi.put(
    "/table/column",
    verifyToken,
    async (req: Request, res: Response) => {
      console.log("addColumn");

      try {
        const {
          dbName,
          table,
          columnName,
          columnType,
          columnOption,
          defaultValue,
        } = req.body as AddColumnObj;

        // 驗證參數
        if (!dbName || !table || !columnName || !columnType) {
          return res
            .status(400)
            .json({ error: true, message: "缺少必要的參數" });
        }

        const updateUtility = new UpdateUtility(req.db);
        const userId = req.user!.userId;

        const params: AddColumnObj = {
          dbName,
          table,
          columnName,
          columnType,
          columnOption,
          defaultValue,
        };
        const data = await updateUtility.addColumn(userId, params);

        return res.status(200).json({ data: data });
      } catch (err: any) {
        console.error("Error in addColumn: ", err);

        if ("sqlMessage" in err) {
          return res.status(400).json({ error: true, message: err.sqlMessage });
        }
        return res.status(500).json({ error: true, message: "內部服務器錯誤" });
      }
    }
  );

  // 修改表格刪除指定 Column
  updateApi.delete(
    "/table/column",
    verifyToken,
    async (req: Request, res: Response) => {
      console.log("delColumn");

      try {
        const { dbName, table, columnName } = req.body as delColumnObj;

        // 驗證參數
        if (!dbName || !table || !columnName) {
          return res
            .status(400)
            .json({ error: true, message: "缺少必要的參數" });
        }

        const updateUtility = new UpdateUtility(req.db);
        const userId = req.user!.userId;

        const params: delColumnObj = {
          dbName: dbName,
          table: table,
          columnName: columnName,
        };
        const data = await updateUtility.delColumn(userId, params);

        return res.status(200).json({ data: data });
      } catch (err: any) {
        console.error("Error in delColumn: ", err);

        if ("sqlMessage" in err) {
          return res.status(400).json({ error: true, message: err.sqlMessage });
        }
        return res.status(500).json({ error: true, message: "內部服務器錯誤" });
      }
    }
  );

  return updateApi;
}
