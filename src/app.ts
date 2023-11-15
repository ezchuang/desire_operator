import express, { Express, Request, Response } from "express";
import http from "http";
import * as dotenv from "dotenv";

// import multer from 'multer';
// import s3Connector from './models/s3Connector'; // 暫時用不到

import createApi from "./controllers/routes/createApi";
import readApi from "./controllers/routes/readApi";
import updateApi from "./controllers/routes/updateApi";
import deleteApi from "./controllers/routes/deleteApi";

dotenv.config();

async function appInit() {
  const app: Express = express();
  const port: number = Number(process.env.PORT) || 5252;
  const server = http.createServer(app);

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
  app.set("view engine", "ejs");
  app.set("views", "src/views");
  app.use(express.static("src/public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routers
  app.use("/api", await createApi());
  app.use("/api", await readApi());
  app.use("/api", await updateApi());
  app.use("/api", await deleteApi());

  app.get("/", (req: Request, res: Response) => {
    return res.render("index");
  });

  // import * as jwt from "jsonwebtoken";

  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

appInit();
