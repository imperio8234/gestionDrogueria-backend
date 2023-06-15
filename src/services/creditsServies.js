const conexion = require("../toolsDev/midelware/bd_conection");

const GetAllCustomersDB = () => {
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM creditos", (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

const DeleteCustomersDB = (id) => {
  return new Promise((resolve, reject) => {
    conexion.query("DELETE FROM creditos WHERE id_credito=?", [id], (err, result) => {
      if (err) {
        const err1 = err;
        reject(err1);
      } else {
        resolve(result);
      }
    });
  });
};

const UdateCustomersDB = (updateCustomer) => {
  const { nombre, idCredito, fecha, celular } = updateCustomer;
  return new Promise((resolve, reject) => {
    conexion.query("UPDATE creditos SET nombre =?, celular =?, fecha =? WHERE id_credito=?", [nombre, celular, fecha, idCredito], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

const CreateCustomersDB = (customer) => {
  const { idUsuario, nombre, phoneNumber, date } = customer;
  console.log(idUsuario, nombre, phoneNumber, date);

  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM creditos WHERE nombre =?", [nombre], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (!result.length <= 0) {
          resolve(false);
        } else {
          conexion.query("INSERT INTO creditos SET ?", [{ nombre, celular: phoneNumber, id_usuario: idUsuario, fecha: date }], (err, row) => {
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
  GetAllCustomersDB,
  DeleteCustomersDB,
  UdateCustomersDB,
  CreateCustomersDB
};
