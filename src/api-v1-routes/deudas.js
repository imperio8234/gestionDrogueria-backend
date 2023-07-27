const express = require("express");
const { GetDeudas, CreateDeudas, UpdateDeudas, DeletDeudas, findDeudas } = require("../controllers/controllersDeudas");
const router = express.Router();

router.get("/:id/:page", GetDeudas);
router.get("/buscar/:id/:words", findDeudas);
router.post("/", CreateDeudas);
router.put("/", UpdateDeudas);
router.delete("/:id", DeletDeudas);

module.exports = router;
