const express = require("express");
const router = express.Router();
const { getAllproducts, createProducts, updateProducts, deleteProducts } = require("../controllers/controllerProduct");
const Activation = require("../toolsDev/midelware/verifyActivation");
const verify = require("../toolsDev/midelware/verifyToken");

router.get("/:id/:page", verify, Activation, getAllproducts);
router.post("/", createProducts);
router.put("/", updateProducts);
router.delete("/:idproduct", deleteProducts);
module.exports = router;
