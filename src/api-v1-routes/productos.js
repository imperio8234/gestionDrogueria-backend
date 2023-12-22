const express = require("express");
const router = express.Router();
const { getAllproducts, createProducts, updateProducts, deleteProducts, findProduct, comprarProductos } = require("../controllers/controllerProduct");
const verify = require("../toolsDev/midelware/verifyToken");
const verifyActivation = require("../toolsDev/midelware/verifyActivation");

router.get("/:page", verify, getAllproducts);
router.get("/buscar/:words/:id_deuda", verify, findProduct);
router.post("/", verify, verifyActivation, createProducts);
router.post("/comprar", verify, verifyActivation, comprarProductos);
router.put("/", verify, verifyActivation, updateProducts);
router.delete("/:idproduct", verify, deleteProducts);
module.exports = router;
