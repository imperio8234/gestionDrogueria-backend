const conexion = require("../toolsDev/midelware/bd_conection");
const bcrypt = require("bcryptjs");

const getAllUsersDB = () => {
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM administrador", [], () => {});
  });
};
const createUsersDB = (user) => {
  const { nombre, correo, celular, pass } = user;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM administrador WHERE correo=?", [correo], (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        if (!result.length <= 0) {
          resolve({ message: "el usuario ya se encuentra registrado con este correo", success: false });
        } else {
          conexion.query("INSERT INTO administrador SET?", [{ nombre, correo, celular, contraseña: pass }], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve({ message: "usuario registrado", row: row.affectedRows, success: true });
            }
          });
        }
      }
    });
  });
};
const updateUsersDB = (req, res) => {
  return new Promise((resolve, reject) => {
    conexion.query("UPDATE administrador SET nombre=?, correo=?, celular=?, contraseña=? WHERE id_usuario =?", [], () => {});
  });
};
const deleteUsersDB = (req, res) => {
  return new Promise((resolve, reject) => {
    conexion.query("", [], () => {});
  });
};

const authenticateUserDB = (user) => {
  const { correo, contraseña } = user;

  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM administrador WHERE correo =? ", [correo], (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        // hay registro del email ?
        if (result.length <= 0) {
          resolve({ success: false, message: "no esta registrado" });
        } else {
          const contraseñaHass = result[0].contraseña;
          const isUser = bcrypt.compareSync(contraseña, contraseñaHass);
          if (isUser) {
            resolve({ success: true, data: result });
          } else {
            resolve({ success: false, message: "contraseña o correo incorrecto" });
          }
        }
      }
    });
  });
};

const recoverPasswordDB = () => {
  return new Promise((resolve, reject) => {
    conexion.query("", [], () => {});
  });
};

module.exports = {
  getAllUsersDB,
  recoverPasswordDB,
  authenticateUserDB,
  deleteUsersDB,
  updateUsersDB,
  createUsersDB
};
