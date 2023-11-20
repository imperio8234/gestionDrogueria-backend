const { optenerGastos, crearGastos, eliminarGastos, modificarGastos } = require("../controllers/controllersGastos");
const verify = require("../toolsDev/midelware/verifyToken");

const router = require("express").Router();

router.get("/optenergastos", optenerGastos);
router.post("/creargastos", crearGastos);
router.delete("/eliminargastos", eliminarGastos);
router.put("/modificargastos", modificarGastos);
module.exports = router;
