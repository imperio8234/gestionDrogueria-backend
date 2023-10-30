const express = require("express");
const { GetRecord, CreateRecord, UpdateRecord, DeletRecord } = require("../controllers/controllersAddCreditsRecord");
const router = express.Router();
const verify = require("../toolsDev/midelware/verifyToken");
const verifyActivation = require("../toolsDev/midelware/verifyActivation");

router.get("/:id/:page", verify, verifyActivation, GetRecord);
router.post("/", verify, verifyActivation, CreateRecord);
router.put("/", verify, verifyActivation, UpdateRecord);
router.delete("/:id", verify, verifyActivation, DeletRecord);

module.exports = router;
