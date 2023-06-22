const conexion = require("../toolsDev/midelware/bd_conection");
const bcrypt = require("bcryptjs");

const getAllUsersDB = () => {
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM administrador", [], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.length <= 0) {
          resolve({ success: false });
        } else {
          resolve({ success: true, data: result });
        }
      }
    });
  });
};
const createUsersDB = (user) => {
  const { nombre, correo, celular, pass, inicio, fecha, activo, clave } = user;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM administrador WHERE correo=?", [correo], (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        if (!result.length <= 0) {
          resolve({ message: "el usuario ya se encuentra registrado con este correo", success: false });
        } else {
          conexion.query("INSERT INTO administrador SET?", [{ nombre, correo, celular, contraseña: pass, inicio, fecha, activo, clave }], (err, row) => {
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
const updateUsersDB = (user) => {
  const { nombre, correo, celular, idUsuario } = user;
  return new Promise((resolve, reject) => {
    conexion.query("UPDATE administrador SET nombre=?, correo=?, celular=? WHERE id_usuario =?", [{ nombre, correo, celular, id_usuario: idUsuario }], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.affectedRows);
      }
    });
  });
};
const deleteUsersDB = (id) => {
  return new Promise((resolve, reject) => {
    conexion.query("DELETE FROM administrador WHERE id_usuario =?", [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve({ message: "se elimino correctamente", success: true });
      }
    });
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

const recoverPasswordDB = (update) => {
  const { celular, correo, contraseña } = update;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM administrador WHERE correo =? AND celular =?", [correo, celular], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.length <= 0) {
          resolve({ message: "escribe un correo y numero de celular que se encuentren registrados", success: false });
        } else {
          conexion.query("UPDATE administrador SET contraseña=? WHERE correo =?", [contraseña, correo], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve({ message: "se actualizo correctamente la contraseña", success: true });
            }
          });
        }
      }
    });
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
