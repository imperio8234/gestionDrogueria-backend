const express = require("express");
const router = express.Router();
const { getProductosMetrica, getdeudasMetrica, getcreditosMetrica } = require("../controllers/controllersMetrica");
const verify = require("../toolsDev/midelware/verifyToken");
const verifyActivation = require("../toolsDev/midelware/verifyActivation");

router.get("/productos", verify, verifyActivation, getProductosMetrica);
router.get("/deudas", verify, verifyActivation, getdeudasMetrica);
router.get("/creditos", verify, verifyActivation, getcreditosMetrica);

module.exports = router;
