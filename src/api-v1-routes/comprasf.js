const { optenerCompraf, eliminarCompraf, modificarCompraf, crearCompraf } = require("../controllers/controllersComprasFueraInventario");
const verify = require("../toolsDev/midelware/verifyToken");

const router = require("express").Router();

router.get("/optenercompraf/:fecha/:id/:pagina", verify, optenerCompraf);
router.post("/crearcompraf", verify, crearCompraf);
router.delete("/eliminarcompraf/:id", verify, eliminarCompraf);
router.put("/modificarcompraf", verify, modificarCompraf);
module.exports = router;
