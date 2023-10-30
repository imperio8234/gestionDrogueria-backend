const express = require("express");
const { crearVenta, getVentas, getProductosVentas, buscarProducto, getAllVentas, getGraficosVentas } = require("../controllers/controllersVentas");
const router = express.Router();
const verify = require("../toolsDev/midelware/verifyToken");
const verifyActivation = require("../toolsDev/midelware/verifyActivation");

router.get("/history/all/:page", verify, verifyActivation, getAllVentas);
router.get("/history/:fecha/:page", verify, verifyActivation, getVentas);
router.get("/productosventas/:idventa", verify, verifyActivation, getProductosVentas);
router.get("/graficos", verify, verifyActivation, getGraficosVentas);
router.post("/", verify, verifyActivation, crearVenta);
router.get("/buscar/:nombreproducto", verify, verifyActivation, buscarProducto);

// router.put("");
// router.delete("");

module.exports = router;
