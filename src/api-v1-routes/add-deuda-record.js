const express = require("express");
const { GetDeuda, CreateDeuda, UpdateDeuda, DeletDeuda } = require("../controllers/controllersAddDeudaRecord");
const router = express.Router();

router.get("/:id/:page", GetDeuda);
router.post("/", CreateDeuda);
router.put("/", UpdateDeuda);
router.delete("/:id", DeletDeuda);
module.exports = router;
