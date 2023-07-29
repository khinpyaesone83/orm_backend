import { validate } from "class-validator";
import { AppDataSource } from "../data-source";
import { Company } from "../entity/Company";
const { verifyTokenAndAdmin } = require("./VerifyToken");
const express = require("express");
const router = express.Router();

// Create a new Company
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const company = new Company();
    company.name = name;
    company.email = email;
    company.address = address;
    const errors = await validate(company);
    if (errors.length > 0) {
      return res
        .status(400)
        .send({ errors: errors.map((err) => err.constraints) });
    }
    const savedCompany = await AppDataSource.getRepository(Company).save(
      company
    );
    res.status(200).send(savedCompany);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const companies = await AppDataSource.getRepository(Company).find();
    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send({ error: "Error fetching Companies" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const company = await AppDataSource.getRepository(Company).findOneBy({
      id: req.params.id,
    });
    if (!company) {
      return res.status(404).send({ error: "Company not found" });
    }
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send({ error: "Error fetching the Company" });
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const company = await AppDataSource.getRepository(Company).findOneBy({
      id: req.params.id,
    });
    if (!company) {
      return res.status(404).send({ error: "Company not found" });
    }
    const { name, email, address } = req.body;
    company.name = name;
    company.email = email;
    company.address = address;
    const errors = await validate(company);
    if (errors.length > 0) {
      return res
        .status(400)
        .send({ errors: errors.map((err) => err.constraints) });
    }
    const updatedCompany = await AppDataSource.getRepository(Company).save(
      company
    );
    res.status(200).send(updatedCompany);
  } catch (error) {
    res.status(500).send({ error: "Error updating the company" });
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const company = await AppDataSource.getRepository(Company).findOneBy({
      id: req.params.id,
    });
    if (!company) {
      return res.status(404).send({ error: "Company not found" });
    }
    await AppDataSource.getRepository(Company).delete(req.params.id);
    res.status(200).send({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error deleting the Company" });
  }
});

module.exports = router;
