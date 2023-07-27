const express = require("express");
const router = express.Router();
const { getLista, createLista, updateLista, deleteAllLista, deleteLista } =require("../controllers/controllersLista")
router.get("/:id_usuario", getLista);
router.post("/", createLista);
router.put("/", updateLista);
router.delete("/all/:id_usuario", deleteAllLista);
router.delete("/:id_usuario/:id_producto", deleteLista);

module.exports = router;
