const express = require("express");
const router = express.Router();
const { GetAllsubtractCreditRecord, createsubtractCreditRecord, updatesubtractCreditRecord, deletesubtractCreditRecord } = require("../controllers/controllerSubtractCreditRecord");

router.get("/:id/:page", GetAllsubtractCreditRecord);
router.post("/", createsubtractCreditRecord);
router.put("/", updatesubtractCreditRecord);
router.delete("/:id", deletesubtractCreditRecord);

module.exports = router;
