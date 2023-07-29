import "reflect-metadata";
import { DataSource } from "typeorm";
import { Company } from "./entity/Company";
import { Employee } from "./entity/Employee";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root123!@#",
  database: "test_db",
  synchronize: true,
  logging: false,
  entities: [User, Company, Employee],
  migrations: [],
  subscribers: [],
});
