import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//login
router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const user = await AppDataSource.getRepository(User).findOneBy({
      username: req.body.username,
    });
    if (!user) return res.status(401).send("User not found.");
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (Originalpassword !== req.body.password)
      return res.status(401).send("Username or Password is invalid.");

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );
    res.status(200).send({ accessToken });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
