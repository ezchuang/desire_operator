import express, { Express, Request, Response } from 'express';
import http from 'http';

// import multer from 'multer';
// import s3Connector from './models/s3Connector'; // 暫時用不到
import { CreateDBObj, CreateObj, ReadDBsAndTablesObj, ReadObj, UpdateObj, DeleteObj } from 'models/interfaces/QueryObjInterfaces';
import apiRoute from './controllers/routes/api';
import Database from './models/base/DBConstructor';
import CreateService from './models/services/CreateService'


const app: Express = express();
const port: number = 5252
const server = http.createServer(app);
const db = new Database();
const createService = new CreateService(db.getPool())

// 測試區
// const testObj: CreateObj = {
//   dbName: 'horror',
//   table: 'life'
// }
// db.create(testObj)
// db.execute('', [])


// 暫時用不到
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

// middleware
app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.use(express.static('src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routers
app.use('/api', apiRoute);


app.get('/', (req: Request, res: Response) => {
  return res.render('index');
});




server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});