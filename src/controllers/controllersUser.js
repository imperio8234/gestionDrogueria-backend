const { createUsersDB, authenticateUserDB } = require("../services/userServices");
const isNumber = require("../toolsDev/isNumber");
const bcrypt = require("bcryptjs");
const isEmail = require("../toolsDev/isEmail");
const jwt = require("jsonwebtoken");

const getAllUsers = (req, res) => {

};
const createUsers = (req, res) => {
  const { nombre, correo, celular, contraseña } = req.body;
  // contraseña encriptada
  const pass = bcrypt.hashSync(contraseña, 8);
  const user = {
    nombre,
    correo,
    celular,
    pass
  };

  if (!isNumber(celular) || celular.length !== 10) {
    res.json({
      success: false,
      message: "el numero de celular es incorrecto ingresa uno valido"
    });
  } else if (contraseña.length < 9) {
    res.json({
      success: false,
      message: "tu contraseña debe tener mas de 9 caracteres"
    });
  } else if (!isEmail(correo)) {
    res.json({
      success: false,
      message: "ingresa un correo valido"
    });
  } else {
    createUsersDB(user)
      .then(result => {
        if (result.success) {
          res.json({
            success: true,
            message: result.message
          });
        } else {
          res.json({
            success: false,
            message: result.message
          });
        }
      })
      .catch(err => {
        if (err) {
          res.status(500).json({
            message: "hay un error",
            err
          });
        }
      });
  }
};
const updateUsers = (req, res) => {

};
const deleteUsers = (req, res) => {

};

const authenticateUser = (req, res) => {
  const { correo, contraseña } = req.body;
  const user = {
    correo,
    contraseña
  };
  if (!isEmail(correo)) {
    res.json({
      message: "ingresa un correo valido",
      success: false
    });
  } else if (contraseña.length < 9) {
    res.json({
      message: "tu contraseña debe tener 9 caracteres",
      success: false
    });
  } else {
    authenticateUserDB(user)
      .then(result => {
        const data = {
          id_usuario: result.data[0].id_usuario,
          nombre: result.data[0].nombre,
          celular: result.data[0].celular
        };
        // token
        const token = jwt.sign(data, "ESTE_ES_UN_SECRETO", { expiresIn: "10m" });
        if (result.success) {
          res.json({
            success: true,
            message: "ingreso exitoso",
            data,
            token
          });
        } else {
          res.json({
            success: false,
            message: result.message
          });
        }
      })
      .catch(err => {
        if (err) {
          res.status(505).json({
            message: "hay un problema",
            err
          });
        }
      });
  }
};

const recoverPassword = () => {

};

module.exports = {
  getAllUsers,
  createUsers,
  updateUsers,
  deleteUsers,
  authenticateUser,
  recoverPassword

};
