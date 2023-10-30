const express = require("express");
const router = express.Router();
const { getLista, createLista, updateLista, deleteAllLista, deleteLista } = require("../controllers/controllersLista");
const verify = require("../toolsDev/midelware/verifyToken");
const verifyActivation = require("../toolsDev/midelware/verifyActivation");

router.get("/", verify, verifyActivation, getLista);
router.post("/", verify, verifyActivation, createLista);
router.put("/", verify, verifyActivation, updateLista);
router.delete("/all", verify, verifyActivation, deleteAllLista);
router.delete("/:id_producto", verify, verifyActivation, deleteLista);

module.exports = router;
