import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import fs from "fs";
import http from "http";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger-output.json";

import Database from "./models/dbConstructor/Database";
import { socketManager } from "./controllers/routes/socketManager";
import userApi from "./controllers/routes/userApi";
import createApi from "./controllers/routes/createApi";
import readApi from "./controllers/routes/readApi";
import updateApi from "./controllers/routes/updateApi";
import deleteApi from "./controllers/routes/deleteApi";
import historyApi from "./controllers/routes/historyApi";

dotenv.config();

// JWT secret key
global.secretKey = process.env.JWT_SECRET_KEY || "your-secret-key";
global.privateKey = fs.readFileSync("jwt_private_key.pem", "utf8");
global.publicKey = fs.readFileSync("jwt_public_key.pem", "utf8");
// 群組與資料庫連接池的映射，[群組登入者, 群組DB]
global.groupDbMap = new Map<string, Database>();
// 用戶對群組映射，[使用者編號, 群組登入者]
global.userGroupMap = new Map<string, string>();

async function appInit() {
  const app: Express = express();
  const port: number = Number(process.env.PORT) || 5252;
  const server = http.createServer(app);
  // 建立 websocket instance，利用 .getIo() 獲取此 instance
  socketManager.initialize(server);

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

  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

appInit();
