const express = require("express");
const {
  getAllUsers,
  updateUsers,
  createUsers,
  deleteUsers,
  authenticateUser,
  recoverPassword
} = require("../controllers/controllersUser");
const router = express.Router();

router.get("/", getAllUsers);
router.put("/", updateUsers);
router.put("/password", recoverPassword);
router.post("/aut", authenticateUser);
router.post("/", createUsers);
router.delete("/:id", deleteUsers);

module.exports = router;
