const conexion = require("../toolsDev/midelware/bd_conection");

const GetAllCustomersDB = (id, pagina) => {
  const page = (pagina - 1) * 20;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM creditos WHERE id_usuario =? LIMIT 20 OFFSET ?", [id, page], (err, result) => {
      if (err) {
        reject(err);
        console.log(err, 1)
      }
      conexion.query("SELECT CEIL(COUNT(*)/ 20) AS paginas FROM creditos", (err, pages) => {
        if (err) {
          reject(err);
          console.log(err, 2)
        } else {
          // calcular el valor total de cada credito
          conexion.query("select id_credito from creditos where id_usuario = ?", [id], (err, user) => {
            if (err) {
              reject(err.message);
              console.log(err, 3)
            } else {
            // se recojen las identificaciones
              const idUsuarios = [];
              for (const i in user) {
                idUsuarios.push(user[i].id_credito);
              }
              conexion.query(`select id_credito, sum(valor) as total
              from(
              select id_credito, valor from suma_credito
              union all
              select id_credito, valor from abonos_credito
              )as id_credito
              where id_credito in (${idUsuarios})
              group by id_credito`, (err, valorTotal) => {
                if (err) {
                  reject(err.message);
                  console.log(err, 4)
                } else {
                  // sumatoria de todos los valores
                  const valorT = [0];
                  for (const i in valorTotal) {
                    valorT.push(valorTotal[i].total);
                  }
                  const resultValor = valorT.reduce((a, b) => {
                    return a + b;
                  });
                  resolve({ success: true, data: { data: result, totalcreditos: resultValor }, paginas: pages[0] });
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
