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
import { publicApiRouter } from "./router/public_api.router";
import { authentification } from "./middleware/auth.middleware";


dotenv.config();

const { PORT = 3000 } = process.env;
const { HOST = 'localhost' } = process.env;
const { ADMIN_APP_PORT = 5173 } = process.env;
const { ADMIN_APP_HOST = 'localhost' } = process.env;

const app = express();
app.use(express.json());
app.use(helmet()) 
app.use(errorHandler);

app.use(cors({origin: '*', preflightContinue: true}))
app.use(publicApiRouter)

const options: cors.CorsOptions = {
  origin: [`${ADMIN_APP_HOST}:${ADMIN_APP_PORT}`]
};

app.use(cors(options));
app.use(apiRouter);
app.use(userRouter);

app.get("*", (req: Request, res: Response) => {
  res.status(505).json({ message: "Bad Request" });
});

DataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server is running on ${HOST}:${PORT}`);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error:Error) => console.log(error));