const conexion = require("../toolsDev/midelware/bd_conection");
const crearGastosDB = (idGasto, idUsuario, descripcion, valorGasto, fecha) => {
  return new Promise((resolve, reject) => {
    conexion.query("insert into gastos (id_gasto, id_usuario, descripcion, valor_gasto, fecha, categoria) VALUES (?,?,?,?,?,?)",
      [idGasto, idUsuario, descripcion, valorGasto, fecha], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const modificarGastosDB = () => {
  return new Promise((resolve, reject) => {
    conexion.query("", [], (err, result) => {

    });
  });
};

const optenerGastosDB = () => {
  return new Promise((resolve, reject) => {
    conexion.query("", [], (err, result) => {

    });
  });
};

const eliminarGastosDB = () => {
  return new Promise((resolve, reject) => {
    conexion.query("", [], (err, result) => {

    });
  });
};

module.exports = {
  crearGastosDB,
  modificarGastosDB,
  optenerGastosDB,
  eliminarGastosDB

};
