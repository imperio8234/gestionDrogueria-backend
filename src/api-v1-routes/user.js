const express = require("express");
const {
  getAllUsers,
  updateUsers,
  createUsers,
  deleteUsers,
  authenticateUser,
  recoverPassword,
  getUser
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
router.delete("/", verify, deleteUsers);

const token =  [
  'aut=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxMywibm9tYnJlIjoicGVkcm8iLCJhY3Rpdm8iOjEsImZlY2hhIjoiNC8zLzIwMjQiLCJpbmljaW8iOiI0Iiwibm9tYnJlTmVnb2NpbyI6bnVsbCwiY2VsdWxhciI6IjA5ODcxMjM0NTYiLCJpYXQiOjE3MDk1Nzg2MDEsImV4cCI6MTcwOTYxNDYwMX0.-qBEhaKdwGDUMKn0TkIhT_WinXYsj0nAsN-08Ru3Q8Q; Path=/; HttpOnly'
]
console.log(token[0].split(";")[0])

module.exports = router;
