const {cambiarContraseñaDB, createUsersDB, authenticateUserDB, deleteUsersDB, recoverPasswordDB, updateUsersDB, getAllUsersDB, getUserDB } = require("../services/userServices");
const isNumber = require("../toolsDev/isNumber");
const bcrypt = require("bcryptjs");
const isEmail = require("../toolsDev/isEmail");
const jwt = require("jsonwebtoken");
const sendEmail = require("../toolsDev/sendEmail");
const sendEmailOaut = require("../toolsDev/sendEmailOaut");
const random = require("../toolsDev/random");
const useverifyDate = require("../toolsDev/useVerIfyDate");
const getDate = require("../toolsDev/getDate");

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
const getUser = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  getUserDB(idUsuario)
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
  const { nombre, correo, celular, contraseña, negocio, nit, direccion } = req.body;
  // contraseña encriptada
  const pass = bcrypt.hashSync(contraseña, 8);

  const user = {
    nombre,
    correo,
    celular,
    pass,
    activo: true,
    fecha: getDate(),
    inicio: getDate(),
    clave: random(1000, 9000),
    negocio,
    nit: nit?nit:0,
    direccion
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
        console.log(err)
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
  const idUsuario = req.usuario.id_usuario;
  const { nombre, correo, celular, negocio, nit, direccion } = req.body;
  const usuario = {
    nombre,
    correo,
    celular,
    idUsuario,
    negocio,
    nit,
    direccion
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
  const id = req.usuario.id_usuario;
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

  if (isEmail(correo)) {
    if (!isEmail(correo)) {
      res.json({
        message: "ingresa un correo valido",
        success: false
      });
      return;
    } 

    if (contraseña.length < 9) {
      res.json({
        message: "tu contraseña debe tener 9 caracteres",
        success: false
      });
      return;
    } 
    aut(user)
  } else {
    if (!isNumber(correo)) {
      res.json({
        message: "ingresa un numero de celular valido",
        success: false
      })
      return;
    }
    if (contraseña.length < 9) {
      res.json({
        message: "tu contraseña debe tener 9 caracteres",
        success: false
      });
      return;
    } 
    aut(user);
  }
  
  
   // funcion para la 
    function aut (data) {
      authenticateUserDB(data)
      .then(result => {
        if (result.success) {
          const data = {
            id_usuario: result.data[0].id_usuario,
            nombre: result.data[0].nombre,
            activo: result.data[0].activo,
            fecha: result.data[0].fecha,
            inicio: result.data[0].inicio,
            nombreNegocio: result.data[0].nombreNegocio,
            celular: result.data[0].celular
          };

          // fecha
          const date = data.fecha.split("/");
          const newDate = [date[2], date[1], date[0]].join("-");
          const periodoExpirado = useverifyDate(newDate);
          // token
          const fechaActual = new Date();

          // Definir la fecha y hora de expiración (1 año después)
          const fechaExpiracion = new Date(fechaActual);
          fechaExpiracion.setFullYear(fechaActual.getFullYear() + 1);
          
          // Genera el token con la fecha de expiración
          const token = jwt.sign({
            exp: Math.floor(fechaExpiracion.getTime() / 1000), // La expiración se debe expresar en segundos
            ...data,
          }, 'ESTE_ES_UN_SECRETO');
          // enviar cookie
          res.cookie("aut", token, { path: "/", httpOnly: true });
          res.json({
            success: true,
            message: "ingreso exitoso",
            data,
            diasActivo: periodoExpirado
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
          message: "tu contraseña se cambio correctamente, revisa tu correo y cambiala lo mas pronto posible ",
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

const cambiarContraseña = (req, res) => {
  const {newPass, currentPass} = req.body;
  const idUsuario = req.usuario.id_usuario
  const pasToString = newPass.toString()
  const contraseña = bcrypt.hashSync(pasToString, 10);
  cambiarContraseñaDB(contraseña, currentPass, idUsuario)
  .then((result) => {
    if (result.success) {
      res.status(200).json({
        message:"se actualizo correctamente tu contraseña",
        success: true
      })
    } else {
      res.status(400).json({
        message: "La contraseña ingresada no coincide con la confirmación de la contraseña. Por favor, verifica tus contraseñas e intenta nuevamente.",
        success: false
      })
      
    }
  })
  .catch((err) => {
    if (err) {
      res.json({
        message: err,
        success: false
      })
    }
  })

}
module.exports = {
  getAllUsers,
  createUsers,
  updateUsers,
  deleteUsers,
  authenticateUser,
  recoverPassword,
  getUser,
  cambiarContraseña

};
