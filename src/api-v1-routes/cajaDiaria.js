const { optenercajaDiaria, eliminarcajaDiaria, modificarcajaDiaria, crearcajaDiaria } = require("../controllers/controllersCajaDiaria");
const verify = require("../toolsDev/midelware/verifyToken");

const router = require("express").Router();

router.get("/optenercaja/:fecha/:pagina",verify, optenercajaDiaria);
router.post("/crearcaja",verify, crearcajaDiaria);
router.delete("/eliminarcaja/:id",verify, eliminarcajaDiaria);
router.put("/modificarcaja",verify,  modificarcajaDiaria);
module.exports = router;
