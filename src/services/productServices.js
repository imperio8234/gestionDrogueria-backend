const conexion = require("../toolsDev/midelware/bd_conection");

const GetAllproductDB = () => {
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM productos", (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

const DeleteproductDB = (id) => {
  return new Promise((resolve, reject) => {
    conexion.query("DELETE FROM productos WHERE id_producto=?", [id], (err, result) => {
      if (err) {
        const err1 = err;
        reject(err1);
      } else {
        resolve(result);
      }
    });
  });
};

const UpdateproductDB = (updateProduct) => {
  const { nombre, costo, precio, laboratorio, unidades, idProduct } = updateProduct;
  return new Promise((resolve, reject) => {
    conexion.query("UPDATE productos SET nombre =?, unidades =?, precio =?, laboratorio=?, costo=?  WHERE id_producto=?", [nombre, unidades, precio, laboratorio, costo, idProduct], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

const CreateproductDB = (customer) => {
  const { nombre, idUsuario, costo, precio, laboratorio, unidades } = customer;

  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM productos WHERE nombre =?", [nombre], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (!result.length <= 0) {
          resolve(false);
        } else {
          conexion.query("INSERT INTO productos SET ?", [{ nombre, id_usuario: idUsuario, costo, precio, laboratorio, unidades }], (err, row) => {
            if (err) {
              reject(err.message);
            } else {
              resolve(true);
            }
          });
        }
      }
    });
  });
};

module.exports = {
  GetAllproductDB,
  DeleteproductDB,
  UpdateproductDB,
  CreateproductDB
};
