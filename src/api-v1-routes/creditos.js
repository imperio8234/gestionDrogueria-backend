const express = require("express");
const { findCustomers, GetCustomers, CreateCustomers, DeletCustomers, UpdateCustomers } = require("../controllers/conttrolersCredits");
const verify = require("../toolsDev/midelware/verifyToken");
const verifyActivation = require("../toolsDev/midelware/verifyActivation");
const router = express.Router();

router.get("/find/:words", verify, findCustomers);
router.get("/:page", verify, GetCustomers);
router.post("/", verify, verifyActivation, CreateCustomers);
router.delete("/:idcustomer", verify, DeletCustomers);
router.put("/", verify, verifyActivation, UpdateCustomers);

module.exports = router;
