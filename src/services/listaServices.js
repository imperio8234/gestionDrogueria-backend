const conexion = require("../toolsDev/midelware/bd_conection");
const getListaDB = (idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from lista where id_usuario =? ", [idUsuario], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
const createListaDB = (producto) => {
  const { idUsuario, nombre, unidades, precio, valorTotal, idProducto, laboratorio } = producto;
  return new Promise((resolve, reject) => {
    conexion.query("select id_producto from lista where id_producto = ?", [idProducto], (err, id) => {
      if (err) {
        reject(err);
      } else {
        // evaluamos si existen productos en la lista y si no hay se agregan si si hay se suma la cantidad
        if (id.length <= 0) {
          conexion.query("insert into lista set id_usuario =?, nombre =?, unidades=?, precio=?, valor_total=?, id_producto=?, laboratorio=? ",
            [idUsuario, nombre, unidades, precio, valorTotal, idProducto, laboratorio], (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve({ success: true, message: "se agrego exitosamente", result });
              }
            });
        } else {
          // a qui si si hay registros del roducto se suma las cantidades y el valor nuevo
          conexion.query("update lista set unidades= unidades + ?, valor_total=? where id_producto =?", [unidades, valorTotal, idProducto], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve({ success: true, message: "agregado" });
            }
          });
        }
      }
    });
  });
};
const UpdateListaDB = (producto) => {
  const { idUsuario, idProducto, unidades, valorTotal } = producto;
  return new Promise((resolve, reject) => {
    conexion.query("update lista set unidades=?, valor_total=? where id_usuario=? and id_producto =?", [unidades, valorTotal, idUsuario, idProducto],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};
const deleteListaDB = (idUsuario, idProducto) => {
  return new Promise((resolve, reject) => {
    conexion.query("delete from lista where id_usuario=? and id_producto=?", [idUsuario, idProducto],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ success: true, message: "se elimino", result });
        }
      });
  });
};

const deleteAllListaDB = (idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("delete from lista where id_usuario=?", [idUsuario], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
module.exports = {
  getListaDB,
  createListaDB,
  UpdateListaDB,
  deleteListaDB,
  deleteAllListaDB
};
