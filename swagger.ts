import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "My API",
    description: "API Documentation",
  },
  host: "localhost:5252",
  schemes: ["http"],
};

const outputFile = "./src/swagger-output.json";
const endpointsFiles = ["./src/app.ts"]; // 路由文件的路徑

swaggerAutogen()(outputFile, endpointsFiles, doc);
