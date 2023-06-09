const express = require("express");
const { GetCustomers } = require("../controllers/conttrolersCredits");


const router = express.Router();

router.get("/", GetCustomers);
router.post("/", () => {

});
router.delete("/", () => {

});
router.put("/", () => {

});

module.exports = router;
