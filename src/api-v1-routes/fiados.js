const { optenerFiado, crearFiado, eliminarFiado, modificarFiado } = require("../controllers/controllersFiados");
const verify = require("../toolsDev/midelware/verifyToken");

const router = require("express").Router();

router.get("/optenerfiado/:fecha/:id/:pagina", verify, optenerFiado);
router.post("/crearfiado", verify, crearFiado);
router.delete("/eliminarfiado/:id", verify, eliminarFiado);
router.put("/modificarfiado", verify, modificarFiado);
module.exports = router;
