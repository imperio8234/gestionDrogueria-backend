const express = require("express");
const { GetCustomers, CreateCustomers, DeletCustomers, UpdateCustomers } = require("../controllers/conttrolersCredits");

const router = express.Router();

router.get("/", GetCustomers);
router.post("/", CreateCustomers);
router.delete("/:idcustomer", DeletCustomers);
router.put("/", UpdateCustomers);

module.exports = router;
