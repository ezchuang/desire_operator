import express, { Request, Response, IRouter } from 'express';
import { UpdateObj } from 'models/interfaces/QueryObjInterfaces';
import { db } from 'app'
import UpdateService from 'models/services/UpdateService'


const updateApi: IRouter = express.Router();

const updateService = new UpdateService(db.getPool());

/* 寫一個 middleware 驗證使用者 */
/* 多寫一個 model 用來檢測使用者 */


// createApi.post('/createDb', async (req: Request, res: Response) => {
//     try {
//         /* 做 token 轉換後，未完成 */
//         const userID = req.body.creatorUsername

//         const params: UpdateObj = {
//             dbName : req.body.dbName,
//             creatorUsername : userID,
//         }
//         const data = await updateService.update(params); // true or error

//         return res.status(200).json({ 'data': data });
//     } catch(err) {
//         return res.status(500).json({ 'error': err });
//     }
// });

updateApi.post('/createData', async (req: Request, res: Response) => {
    try {
        const params: UpdateObj = {
            dbName : req.body.dbName,
            table : req.body.table,
            data: req.body.columns,
        }
        const data = await updateService.update(params);

        return res.status(200).json({ 'data': data });
    } catch(err) {
        return res.status(500).json({ 'error': err });
    }
});

export default updateApi;