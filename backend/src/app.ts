import express, { Application } from "express";
import routes from "./routes/index.route";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import cookieParser from "cookie-parser";
import cors from 'cors'
dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
app.use("/api", routes);
app.listen(PORT, () => {
  `console.log(Server running on port ${PORT})`;
});
