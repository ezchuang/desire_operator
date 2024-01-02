// import swaggerAutogen from "swagger-autogen";
const swaggerAutogen = require("swagger-autogen");

const doc = {
  info: {
    version: "1.0.0",
    title: "MySQL Speaker",
    description: "API Documentation of MySQL Speaker",
  },
  servers: [
    {
      url: "https://mysqlspeaker.online/",
      description: "",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
      },
    },
    schemas: {},
  },
};

const outputFile = "./src/swagger-output.json";
const endpointsFiles = ["./src/app.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
