const express = require("express");
const { GetDeudas, CreateDeudas, UpdateDeudas, DeletDeudas, findDeudas } = require("../controllers/controllersDeudas");
const router = express.Router();
const verify = require("../toolsDev/midelware/verifyToken");
const verifyActivation = require("../toolsDev/midelware/verifyActivation");

router.get("/:page", verify, GetDeudas);
router.get("/find/:words", verify, findDeudas);
router.post("/", verify, verifyActivation, CreateDeudas);
router.put("/", verify, verifyActivation, UpdateDeudas);
router.delete("/:id", verify, DeletDeudas);

module.exports = router;
