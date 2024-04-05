const { optenerCreditof, crearCreditof, eliminarCreditof, modificarCreditof } = require("../controllers/controllerCreditosf");
const verify = require("../toolsDev/midelware/verifyToken");

const router = require("express").Router();

router.get("/:id/:pagina",verify, optenerCreditof);
router.post("/crearCreditof",verify, crearCreditof);
router.delete("/:id",verify, eliminarCreditof);
router.put("/",verify, modificarCreditof);
module.exports = router;
