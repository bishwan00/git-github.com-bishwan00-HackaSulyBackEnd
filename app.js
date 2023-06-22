import express from "express";
import path from "path";
import postRouters from "./routers/postRouters.js";

import userRoutes from "./routers/userRouters.js";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { trimQueryMiddleware } from "./middlewares/trimQueryMiddleware.js";
import "./strategy/auth.js";
import { errorHandler } from "./middlewares/errorHandlerMiddleware.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpecs } from "./config/swagger.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(trimQueryMiddleware);
app.use(cors());

connectDB();
if (process.env.NODE_NAME === "Production") app.use(morgan("dev"));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRouters);

app.use(errorHandler);
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
export default app;
