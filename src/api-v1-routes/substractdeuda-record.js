const express = require("express");
const { createsubtractDeudaRecord, GetAllsubtractDeudaRecord, updatesubtractDeudaRecord, deletesubtractDeudaRecord } = require("../controllers/controllersSubstractDeudaRecord");
const router = express.Router();

router.get("/:id/:page", GetAllsubtractDeudaRecord);
router.post("/", createsubtractDeudaRecord);
router.put("/", updatesubtractDeudaRecord);
router.delete("/:id", deletesubtractDeudaRecord);

module.exports = router;
