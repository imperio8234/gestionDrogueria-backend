const express = require("express");
const router = express.Router();
const { getProductosMetrica, getdeudasMetrica, getcreditosMetrica, optenerComprasYventas, exportar } = require("../controllers/controllersMetrica");
const verify = require("../toolsDev/midelware/verifyToken");
const verifyActivation = require("../toolsDev/midelware/verifyActivation");

router.get("/productos", verify, verifyActivation, getProductosMetrica);
router.get("/exportar/:fecha", verify, verifyActivation, exportar);
router.get("/deudas", verify, verifyActivation, getdeudasMetrica);
router.get("/creditos", verify, verifyActivation, getcreditosMetrica);
router.get("/balance/:mes", verify, optenerComprasYventas);

module.exports = router;
