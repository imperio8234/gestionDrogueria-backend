const express = require("express");
const { GetDeudas, CreateDeudas, UpdateDeudas, DeletDeudas } = require("../controllers/controllersDeudas");
const router = express.Router();

router.get("/:id/:page", GetDeudas);
router.post("/", CreateDeudas);
router.put("/", UpdateDeudas);
router.delete("/:id", DeletDeudas);

module.exports = router;
