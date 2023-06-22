const express = require("express");
const router = express.Router();
const { getProductosMetrica, getdeudasMetrica, getcreditosMetrica } = require("../controllers/controllersMetrica");

router.get("/productos/:id", getProductosMetrica);
router.get("/deudas/:id", getdeudasMetrica);
router.get("/creditos/:id", getcreditosMetrica);

module.exports = router;
