import swaggerJsdoc from "swagger-jsdoc";

const option = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "petStore API",
      description: "bitbootcamp project",
      //   license: {
      //     name: "MIT",
      //     url: "https://spdx.org/licenses/MIT.html",
      //   },
      contact: {
        name: "Bishwan Sherko",
        url: "https://bishwan.vercel.app/?fbclid=IwAR19Fm9ZWafPIyM8OiSZKmvjsuaK2SOtQW3h6PPMrFBbZZvOoa9vSFC6BwM",
        email: "bishwan.00606094@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routers/*.js"],
};

export const swaggerSpecs = swaggerJsdoc(option);
