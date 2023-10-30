const express = require("express");
const router = express.Router();
const { getAllproducts, createProducts, updateProducts, deleteProducts, findProduct } = require("../controllers/controllerProduct");
const verify = require("../toolsDev/midelware/verifyToken");
const verifyActivation = require("../toolsDev/midelware/verifyActivation");

router.get("/:page", verify, getAllproducts);
router.get("/buscar/:words", verify, findProduct);
router.post("/", verify, verifyActivation, createProducts);
router.put("/", verify, verifyActivation, updateProducts);
router.delete("/:idproduct", verify, deleteProducts);
module.exports = router;
