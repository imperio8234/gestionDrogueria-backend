const express = require("express");
const {
  getAllUsers,
  updateUsers,
  createUsers,
  deleteUsers,
  authenticateUser,
  recoverPassword,
  getUser,
  cambiarContraseña
} = require("../controllers/controllersUser");
const router = express.Router();

const verify = require("../toolsDev/midelware/verifyToken");
const verifyActivation = require("../toolsDev/midelware/verifyActivation");

router.get("/", verify,getUser);
router.get("/all", getAllUsers);
router.put("/", verify, verifyActivation, updateUsers);
router.put("/password", recoverPassword);
router.post("/aut", authenticateUser);
router.post("/", createUsers);
router.post("/change", verify, cambiarContraseña);
router.delete("/", verify, deleteUsers);
module.exports = router;
