require("dotenv").config();
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
const cors = require("cors");
const CryptoJS = require("crypto-js");
const userRoute = require("./routes/User");
const employeeRoute = require("./routes/Employee");
const companyRoute = require("./routes/Company");
const authRoute = require("./routes/Auth");

const express = require("express");
const app = express();

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
    const user = new User();
    user.username = "Admin";
    const password = CryptoJS.AES.encrypt(
      "1234",
      process.env.PASS_SEC
    ).toString();
    user.password = password;
    user.role = "admin";
    await AppDataSource.manager.save(user);

    const user1 = new User();
    user1.username = "John";
    user1.password = CryptoJS.AES.encrypt(
      "1111",
      process.env.PASS_SEC
    ).toString();
    user1.role = "";
    await AppDataSource.manager.save(user1);
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.use(express.json());
app.use(cors());
app.use("/api/user", userRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/company", companyRoute);
app.use("/api/auth", authRoute);

app.listen(4000, () => {
  console.log("server is running at port 4000...");
});
