const { optenerGastos, crearGastos, eliminarGastos, modificarGastos, detallesGastos } = require("../controllers/controllersGastos");
const verify = require("../toolsDev/midelware/verifyToken");

const router = require("express").Router();

router.get("/optenergastos/:mes", verify, optenerGastos);
router.post("/creargastos", verify, crearGastos);
router.delete("/eliminargastos/:id", verify, eliminarGastos);
router.get("/detallesgastos/:categoria/:mes", verify, detallesGastos);
router.put("/modificargastos", verify, modificarGastos);
module.exports = router;
