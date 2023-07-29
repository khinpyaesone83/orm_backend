import { validate } from "class-validator";
import { AppDataSource } from "../data-source";
const { verifyTokenAndAdmin } = require("./VerifyToken");
import { Company } from "../entity/Company";
import { Employee } from "../entity/Employee";
const express = require("express");
const router = express.Router();

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      staffId,
      companyId,
      departments,
      email,
      phone,
      address,
    } = req.body;
    const company = await AppDataSource.getRepository(Company).findOneBy({
      id: companyId,
    });
    // if (!company) {
    //   return res.status(404).send({ error: "Company not found" });
    // }

    const employee = new Employee();
    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.staffId = staffId;
    employee.company = company;
    employee.departments = departments;
    employee.email = email;
    employee.phone = phone;
    employee.address = address;
    const errors = await validate(employee);
    if (errors.length > 0) {
      return res
        .status(400)
        .send({ errors: errors.map((err) => err.constraints) });
    }

    const savedEmployee = await AppDataSource.getRepository(Employee).save(
      employee
    );
    res.status(200).send(savedEmployee);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all Employees
router.get("/", async (req, res) => {
  try {
    const employees = await AppDataSource.getRepository(Employee).find();
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send({ error: "Error fetching Employees" });
  }
});

// Get a specific Employee by ID
router.get("/:id", async (req, res) => {
  try {
    const employee = await AppDataSource.getRepository(Employee).findOneBy({
      id: req.params.id,
    });
    if (!employee) {
      return res.status(404).send({ error: "Employee not found" });
    }
    res.status(200).send(employee);
  } catch (error) {
    res.status(500).send({ error: "Error fetching the Employee" });
  }
});

// Update an Employee
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const employee = await AppDataSource.getRepository(Employee).findOneBy({
      id: req.params.id,
    });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    const {
      firstName,
      lastName,
      companyId,
      departments,
      email,
      phone,
      address,
    } = req.body;
    const company = await AppDataSource.getRepository(Company).findOneBy({
      id: companyId,
    });
    // if (!company) {
    //   return res.status(404).json({ error: "Company not found" });
    // }

    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.company = company;
    employee.departments = departments;
    employee.email = email;
    employee.phone = phone;
    employee.address = address;
    const errors = await validate(employee);
    if (errors.length > 0) {
      return res
        .status(400)
        .send({ errors: errors.map((err) => err.constraints) });
    }
    const updatedEmployee = await AppDataSource.getRepository(Employee).save(
      employee
    );
    res.status(200).send(updatedEmployee);
  } catch (error) {
    res.status(500).send({ error: "Error updating the Employee" });
  }
});

// Delete an Employee
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const employee = await AppDataSource.getRepository(Employee).findOneBy({
      id: req.params.id,
    });
    if (!employee) {
      return res.status(404).send({ error: "Employee not found" });
    }
    await AppDataSource.getRepository(Employee).delete(req.params.id);
    res.status(200).send({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error deleting the Employee" });
  }
});

module.exports = router;
