import "reflect-metadata";
import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import * as PostgressConnectionStringParser from "pg-connection-string";

dotenv.config();

const { DATABASE_URL, NODE_ENV } = process.env;

const parsedConnection = PostgressConnectionStringParser.parse(DATABASE_URL);

let connectionOptions: DataSourceOptions = {
  type: "postgres",
  host: parsedConnection.host,
  port: parseInt(parsedConnection.port || "5432"),
  username: parsedConnection.user,
  password: parsedConnection.password,
  database: parsedConnection.database,

  synchronize: false,
  logging: NODE_ENV === "dev" ? true : false,
  entities: ["src/entity/*{.ts,.js}", "src/entity/views/*{.ts,.js}"],
  migrations: ["src/migrations/*{.ts,.js}"], // where our migrations reside
  subscribers: [],
};

export default new DataSource({
  ...connectionOptions,
});
