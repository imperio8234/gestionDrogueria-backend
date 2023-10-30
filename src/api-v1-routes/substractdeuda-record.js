const express = require("express");
const { createsubtractDeudaRecord, GetAllsubtractDeudaRecord, updatesubtractDeudaRecord, deletesubtractDeudaRecord } = require("../controllers/controllersSubstractDeudaRecord");
const router = express.Router();
const verify = require("../toolsDev/midelware/verifyToken");
const verifyActivation = require("../toolsDev/midelware/verifyActivation");

router.get("/:id/:page", verify, GetAllsubtractDeudaRecord);
router.post("/", verify, verifyActivation, createsubtractDeudaRecord);
router.put("/", verify, verifyActivation, updatesubtractDeudaRecord);
router.delete("/:id", verify, deletesubtractDeudaRecord);

module.exports = router;
