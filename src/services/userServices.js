const conexion = require("../toolsDev/midelware/bd_conection");
const bcrypt = require("bcryptjs");
const isEmail = require("../toolsDev/isEmail");

const getAllUsersDB = () => {
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM administrador", (err, result) => {
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
const getUserDB = (idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM administrador where id_usuario = ?", [idUsuario], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.length <= 0) {
          resolve({ success: false });
        } else {
          delete result[0].contraseña;
          resolve({ success: true, data: result });
        }
      }
    });
  });
};
const createUsersDB = (user) => {
  const { nombre, correo, celular, pass, inicio, fecha, activo, clave, negocio, nit, direccion } = user;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM administrador WHERE correo=?", [correo], (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        if (!result.length <= 0) {
          resolve({ message: "el usuario ya se encuentra registrado con este correo", success: false });
        } else {
          conexion.query("INSERT INTO administrador SET?", [{ nombre, correo, celular, contraseña: pass, inicio, fecha, activo, clave, nombreNegocio: negocio, nit, direccion}], (err, row) => {
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
  const { nombre, correo, celular, idUsuario, negocio, nit, direccion } = user;
  return new Promise((resolve, reject) => {
    conexion.query("UPDATE administrador SET nombre=?, correo=?, celular=?, nombreNegocio = ?, nit =?, direccion =? WHERE id_usuario =?", [nombre, correo, celular, negocio, nit, direccion, idUsuario], (err, row) => {
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
    conexion.query(
      isEmail(correo)?
      "SELECT * FROM administrador WHERE correo =? "
      :
      "select * from administrador where celular = ?"
      
      , [correo], (err, result) => {
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

const cambiarContraseñaDB = (newPass, currentPass, idUsuario) => {

  return new Promise ((resolve, reject) => {
    conexion.query(`
    select 
     contraseña
    from
     administrador
    where 
     id_usuario = ?
    `, [idUsuario], (err, contraseña) => {
      if (err) {
        reject(err)
        return;
      }
      const currentPassDb = contraseña[0].contraseña;
      const isCurrentPass = bcrypt.compareSync(currentPass,currentPassDb);
      if (!isCurrentPass) {
         resolve({success: false})
        return;
      } 
      conexion.query(`
      update 
       administrador
      set 
       contraseña = ?
      where 
       id_usuario =?
      `, [newPass, idUsuario], (err, result) => {
        if(err) {
          reject(err);
          return;
        }

        resolve({success: true})
      })
    })
     
  })
}

module.exports = {
  getAllUsersDB,
  recoverPasswordDB,
  authenticateUserDB,
  deleteUsersDB,
  updateUsersDB,
  createUsersDB,
  getUserDB,
  cambiarContraseñaDB

};
