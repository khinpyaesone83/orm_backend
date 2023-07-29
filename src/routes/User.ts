import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await AppDataSource.getRepository(User).find();
  res.json(users);
});

//get user
router.get("/:id", async (req, res) => {
  try {
    const user = await AppDataSource.getRepository(User).findOneBy({
      id: req.body.id,
    });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
