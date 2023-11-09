import express, { Request, Response, IRouter } from 'express';
import { ReadDbsAndTablesObj, ReadObj } from 'models/interfaces/QueryObjInterfaces';
import { db } from 'app'
import ReadService from 'models/services/ReadService'


const readApi: IRouter = express.Router();

const readService = new ReadService(db.getPool());

/* 寫一個 middleware 驗證使用者 */
/* 多寫一個 model 用來檢測使用者 */


readApi.post('/readDbsAndTables', async (req: Request, res: Response) => {
    try {
        const params: ReadDbsAndTablesObj = {
            dbName: req.body.dbName,
        }
        const data = await readService.readDBsAndTables(params);

        return res.status(200).json({ 'data': data });
    } catch(err) {
        return res.status(500).json({ 'error': err });
    }
});

readApi.post('/readData', async (req: Request, res: Response) => {
    try {
        const params: ReadObj = {
            dbName : req.body.dbName,
            table : req.body.table,
            select: req.body.select,
            where: req.body.where,
            groupBy: req.body.groupBy,
            orderBy: req.body.orderBy,
            orderDirection: req.body.orderDirection,
            limit: req.body.limit,
        }
        const data = await readService.read(params);

        return res.status(200).json({ 'data': data });
    } catch(err) {
        return res.status(500).json({ 'error': err });
    }
});

export default readApi;