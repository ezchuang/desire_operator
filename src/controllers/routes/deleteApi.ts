import express, { Request, Response, IRouter } from "express";
import { DeleteObj } from "../../models/interfaces/QueryObjInterfaces";
// import rootPool from "../../models/getPool/rootPool";
import userPool from "../../models/getPool/userPool";
import DeleteService from "../../models/services/DeleteService";

const deleteApi: IRouter = express.Router();

const deleteService = new DeleteService(userPool);

/* 寫一個 middleware 驗證使用者 */
/* 多寫一個 model 用來檢測使用者 */

// createApi.post('/createDb', async (req: Request, res: Response) => {
//     try {
//         /* 做 token 轉換後，未完成 */
//         const userID = req.body.creatorUsername

//         const params: CreateDbObj = {
//             dbName : req.body.dbName,
//             creatorUsername : userID,
//         }
//         const data = await createService.createDb(params);

//         return res.status(200).json({ 'data': data });
//     } catch(err) {
//         return res.status(500).json({ 'error': err });
//     }
// });

deleteApi.post("/deleteData", async (req: Request, res: Response) => {
  try {
    const params: DeleteObj = {
      dbName: req.body.dbName,
      table: req.body.table,
      where: req.body.where, // 若不需要此值，前端須給空 Array
      /* 檢查是否需要在這邊展開 where 內層 */
    };
    const data = await deleteService.delete(params);

    return res.status(200).json({ data: data });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

export default deleteApi;
