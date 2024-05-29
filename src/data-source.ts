import "reflect-metadata"
import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm"

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } = process.env;

let connectionOptions: DataSourceOptions = {
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT || "5432"),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,

  synchronize: false,
  logging: NODE_ENV === "dev" ? true : false,
  entities: ["src/entity/*{.ts,.js}", "src/entity/views/*{.ts,.js}"],
  migrations: ["src/migrations/*{.ts,.js}"], // where our migrations reside
  subscribers: [],
};

export default new DataSource({
  ...connectionOptions,
});