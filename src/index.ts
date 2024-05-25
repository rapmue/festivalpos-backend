import DataSource from "./data-source";
import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import * as cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware";

import "reflect-metadata";

import { apiRouter } from "./router/api.router";
import { userRouter } from "./router/user.router";


dotenv.config();

const options: cors.CorsOptions = {
    origin: ['localhost:3000']
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet()) 
app.use(errorHandler);
const { PORT = 3000 } = process.env;

app.use(apiRouter);
app.use(userRouter);

app.get("*", (req: Request, res: Response) => {
  res.status(505).json({ message: "Bad Request" });
});

DataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error:Error) => console.log(error));