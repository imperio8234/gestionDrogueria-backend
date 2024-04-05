const conexion = require("../toolsDev/midelware/bd_conection");

const GetAllCustomersDB = (id, pagina) => {
  const page = (pagina - 1) * 20;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM creditos WHERE id_usuario =? LIMIT 20 OFFSET ?", [id, page], (err, result) => {
      if (err) {
        reject(err);
      }
      conexion.query("SELECT CEIL(COUNT(*)/ 20) AS paginas FROM creditos where id_usuario =?", [id], (err, pages) => {
        if (err) {
          reject(err);
        } else {
          // calcular el valor total de cada credito
          conexion.query("select id_credito, sum(valor) valorAbonos from abonos_credito where id_usuario = ? group by id_credito", [id], (err, vAbonos) => {
            if (err) {
              reject(err.message);
            } else {
            // se piden los totales de lac compras
              conexion.query(`
              select id_credito, sum(valor) valorCompras
              from 
                suma_credito
                where 
                id_usuario = ?
                group by id_credito
              `, [id], (err, vCompra) => {
                if (err) {
                  reject(err.message);
                } else {

                  // peticion de los creditosf
                  conexion.query(`
                  select 
                   sum(valor) valor,
                   id_credito
                  from 
                   creditosf
                  where
                   id_usuario =?
                   group by id_credito;
                  `, [id], (err, creditosf) => {
                    if (err) {
                      reject(err);
                      return;
                    }
                                      // sumatoria de todos los valores
                  resolve({ success: true, data: result, paginas: pages[0], vCompra, vAbonos, creditosf });


                  })
                }
              });
            }
          });
        }
      });
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

  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM creditos WHERE nombre =? and id_usuario =?", [nombre, idUsuario], (err, result) => {
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

const findCustomersDB = (id, words) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from creditos where nombre like ? and id_usuario =? ", [`%${words}%`, id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result <= 0) {
          resolve({ success: false, message: "no se encontraron registros" });
        } else {
          resolve({ success: true, result });
        }
      }
    });
  });
};

module.exports = {
  GetAllCustomersDB,
  DeleteCustomersDB,
  UdateCustomersDB,
  CreateCustomersDB,
  findCustomersDB
};
