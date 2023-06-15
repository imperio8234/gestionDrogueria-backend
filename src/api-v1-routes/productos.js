const express = require("express")
const router = express.Router();
const { getAllproducts, createProducts, updateProducts, deleteProducts } = require("../controllers/controllerProduct");
const verify = require("../toolsDev/midelware/verifyToken");

router.get("/", verify, getAllproducts);
router.post("/", createProducts);
router.put("/", updateProducts);
router.delete("/:idproduct", deleteProducts);
module.exports = router;
