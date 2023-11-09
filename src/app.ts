import express, { Express, Request, Response } from 'express';
import http from 'http';

// import multer from 'multer';
// import s3Connector from './models/s3Connector'; // 暫時用不到
import createApi from 'controllers/routes/createApi';
import readApi from 'controllers/routes/readApi';
import updateApi from 'controllers/routes/updateApi';
import deleteApi from 'controllers/routes/deleteApi';
import Database from 'models/base/DbConstructor';


const app: Express = express();
const port: number = 5252;
const server = http.createServer(app);
export const db = new Database();

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
app.use('/api', createApi);
app.use('/api', readApi);
app.use('/api', updateApi);
app.use('/api', deleteApi);


app.get('/', (req: Request, res: Response) => {
  return res.render('index');
});




server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});