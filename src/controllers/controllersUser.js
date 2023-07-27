const { createUsersDB, authenticateUserDB, deleteUsersDB, recoverPasswordDB, updateUsersDB, getAllUsersDB } = require("../services/userServices");
const isNumber = require("../toolsDev/isNumber");
const bcrypt = require("bcryptjs");
const isEmail = require("../toolsDev/isEmail");
const jwt = require("jsonwebtoken");
const sendEmail = require("../toolsDev/sendEmail");
const sendEmailOaut = require("../toolsDev/sendEmailOaut");
const random = require("../toolsDev/random");

const getAllUsers = (req, res) => {
  getAllUsersDB()
    .then(result => {
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.json({
          success: false,
          message: "no se encontraron usuarios"
        });
      }
    })
    .catch(err => {
      if (err) {
        res.json({
          message: "error",
          err
        });
      }
    });
};
const createUsers = (req, res) => {
  const { nombre, correo, celular, contraseña } = req.body;
  // contraseña encriptada
  const pass = bcrypt.hashSync(contraseña, 8);

  const user = {
    nombre,
    correo,
    celular,
    pass,
    activo: true,
    fecha: new Date(),
    inicio: new Date().getDate(),
    clave: random(1000, 9000)
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
          sendEmailOaut(nombre);
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
  const { nombre, correo, celular, idUsuario } = req.body;
  const usuario = {
    nombre,
    correo,
    celular,
    idUsuario
  };
  updateUsersDB(usuario)
    .then(result => {
      if (result) {
        res.json({
          message: "se actualizo el perfil del usuario",
          success: true
        });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).json({
          message: "error",
          err
        });
      }
    });
};
const deleteUsers = (req, res) => {
  const id = req.params.id;
  deleteUsersDB(id)
    .then(result => {
      if (result) {
        res.json({
          success: true,
          message: result.message
        });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).json({
          message: "el usuario no puede ser eliminado deberias eliminar todos los registros asociados ",
          err,
          success: false
        });
      }
    });
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
          activo: result.data[0].activo,
          fecha: result.data[0].fecha,
          inicio: result.data[0].inicio

        };
        // token
        const token = jwt.sign(data, "ESTE_ES_UN_SECRETO", { expiresIn: "10h" });
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

const recoverPassword = (req, res) => {
  const { celular, correo } = req.body;
  const newPass = random(1000000000, 9000000000);
  const pass = newPass.toString();
  const contraseña = bcrypt.hashSync(pass, 10);

  const data = {
    celular,
    correo,
    contraseña
  };
  recoverPasswordDB(data)
    .then(result => {
      if (result.success) {
        sendEmail(correo, pass);
        res.json({
          message: "revisa tu correo usa la contraseña y cambiala lo mas rapido posible",
          success: true
        });
      } else {
        res.json({
          message: result.message,
          success: result.success
        });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).json({ message: "sucedio algo", err });
      }
    });
};

module.exports = {
  getAllUsers,
  createUsers,
  updateUsers,
  deleteUsers,
  authenticateUser,
  recoverPassword

};
