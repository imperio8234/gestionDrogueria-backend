const express = require("express");
const verify = require("../toolsDev/midelware/verifyToken");
const verifyActivation = require("../toolsDev/midelware/verifyActivation");
const { GetDeuda, CreateDeuda, UpdateDeuda, DeletDeuda } = require("../controllers/controllersAddDeudaRecord");
const router = express.Router();

router.get("/:id/:page", verify, verifyActivation, GetDeuda);
router.post("/", verify, verifyActivation, CreateDeuda);
router.put("/", verify, verifyActivation, UpdateDeuda);
router.delete("/:id", verify, verifyActivation, DeletDeuda);
module.exports = router;
