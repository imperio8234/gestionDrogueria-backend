const express = require("express");
const router = express.Router();
const { GetAllsubtractCreditRecord, createsubtractCreditRecord, updatesubtractCreditRecord, deletesubtractCreditRecord } = require("../controllers/controllerSubtractCreditRecord");
const verify = require("../toolsDev/midelware/verifyToken");
const verifyActivation = require("../toolsDev/midelware/verifyActivation");

router.get("/:id/:page", verify, GetAllsubtractCreditRecord);
router.post("/", verify, verifyActivation, createsubtractCreditRecord);
router.put("/", verify, verifyActivation, updatesubtractCreditRecord);
router.delete("/:id", verify, deletesubtractCreditRecord);

module.exports = router;
