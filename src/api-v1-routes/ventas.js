const express = require("express");
const { crearVenta, getVentas, getProductosVentas, buscarProducto } = require("../controllers/controllersVentas");
const router = express.Router();


router.get("/productosventas/:idventa", getProductosVentas);
router.get("/:id/:page", getVentas);
router.post("/", crearVenta);
router.get("/buscar/:nombreproducto/:idusuario", buscarProducto)

//router.put("");
//router.delete("");

module.exports = router;
