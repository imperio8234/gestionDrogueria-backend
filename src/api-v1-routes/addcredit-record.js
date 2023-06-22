const express = require("express");
const { GetRecord, CreateRecord, UpdateRecord, DeletRecord } = require("../controllers/controllersAddCreditsRecord");
const router = express.Router();

router.get("/:id/:page", GetRecord);
router.post("/", CreateRecord);
router.put("/", UpdateRecord);
router.delete("/:id", DeletRecord);

module.exports = router;
