import express, { Request, Response, IRouter } from "express";
import { DeleteObj } from "../../models/base/Interfaces";
import DeleteUtility from "../../models/utility/DeleteUtility";
import verifyToken from "../../controllers/verifyToken";

const deleteApi: IRouter = express.Router();

deleteApi.use(verifyToken);

// 刪除 Database
deleteApi.delete("/database", async (req: Request, res: Response) => {
  // #swagger.tags = ["Delete"]
  // #swagger.description = "Endpoint for deleting a database."

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
});

// 刪除 Table
deleteApi.delete("/table", async (req: Request, res: Response) => {
  // #swagger.tags = ["Delete"]
  // #swagger.description = "Endpoint for deleting a table."

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
});

// 刪除資料
deleteApi.delete("/data", async (req: Request, res: Response) => {
  // #swagger.tags = ["Delete"]
  // #swagger.description = "Endpoint for deleting specific data."

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
});

export default deleteApi;
