import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import http from "http";
import Database from "./models/dbConstructor/Database";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger-output.json";
// import verifyToken from "./controllers/verifyToken";

// import multer from 'multer';
// import s3Connector from './models/s3Connector'; // 暫時用不到
import ioConstructor from "./controllers/routes/socketEntry";
import userApi from "./controllers/routes/userApi";
import createApi from "./controllers/routes/createApi";
import readApi from "./controllers/routes/readApi";
import updateApi from "./controllers/routes/updateApi";
import deleteApi from "./controllers/routes/deleteApi";
import historyApi from "./controllers/routes/historyApi";

dotenv.config();

// JWT secret key
global.secretKey = process.env.JWT_SECRET_KEY || "your-secret-key";
// 群組與資料庫連接池的映射，[使用者群組, 群組DB]
global.groupDbMap = new Map<string, Database>();
// 用戶對群組映射，[使用者編號, 使用者群組]
global.userGroupMap = new Map<string, string>();

async function appInit() {
  const app: Express = express();
  const port: number = Number(process.env.PORT) || 5252;
  const server = http.createServer(app);
  ioConstructor(server);

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
  app.use("/api", await userApi());
  app.use("/api", await createApi());
  app.use("/api", await readApi());
  app.use("/api", await updateApi());
  app.use("/api", await deleteApi());
  app.use("/api", await historyApi());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get("/", (req: Request, res: Response) => {
    return res.render("index");
  });

  app.get("/main", (req: Request, res: Response) => {
    return res.render("main");
  });

  // import * as jwt from "jsonwebtoken";

  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

appInit();
