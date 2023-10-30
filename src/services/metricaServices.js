const conexion = require("../toolsDev/midelware/bd_conection");
const getProductosMetricaDB = (idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from productos where id_usuario =?", [idUsuario], (err, low) => {
      if (err) {
        reject(err.message);
      } else {
        if (low.length <= 0) {
          resolve({ success: false, message: "no hay registros" });
        } else {
          resolve({ success: true, low });
        }
      }
    });
  });
};
const getcreditosMetricaDB = (idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from creditos where id_usuario =?", [idUsuario],
      (err, clientesdb) => {
        if (err) {
          reject(err);
        } else {
          // verificar si hay clientes resgistrados
          if (clientesdb.length <= 0) {
            resolve({ success: false });
          } else {
            const clientes = [];
            clientesdb.map(cliente => clientes.push(cliente.id_credito));
            conexion.query(`select * from suma_credito where id_credito in (${clientes})`,
              (err, sumas) => {
                if (err) {
                  reject(err);
                } else {
                  conexion.query(`select * from abonos_credito where id_credito in (${clientes})`,
                    (err, abonos) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve({ success: true, abonos, sumas, clientesdb });
                      }
                    });
                }
              });
          }
        }
      });
  });
};
const getdeudasMetricaDB = (idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from deudas where id_usuario =?", [idUsuario],
      (err, deudasdb) => {
        if (err) {
          reject(err);
        } else {
          // verificar si hay clientes resgistrados
          if (deudasdb.length <= 0) {
            resolve({ success: false });
          } else {
            const deudas = [];
            deudasdb.map(deuda => deudas.push(deuda.id_credito));
            conexion.query(`select * from suma_deuda where id_credito in (${deudas})`,
              (err, sumas) => {
                if (err) {
                  reject(err);
                } else {
                  conexion.query(`select * from abonos where id_credito in (${deudas})`,
                    (err, abonos) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve({ success: true, abonos, sumas, deudasdb });
                      }
                    });
                }
              });
          }
        }
      });
  });
};

module.exports = {
  getProductosMetricaDB,
  getcreditosMetricaDB,
  getdeudasMetricaDB
};
