const conexion = require("../toolsDev/midelware/bd_conection");

const GetAlldeudaDB = (id, pagina) => {
  const page = (pagina - 1) * 20;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM deudas WHERE id_usuario =? LIMIT 20 OFFSET ?", [id, page], (err, result) => {
      if (err) {
        reject(err);
      } else {
        conexion.query("SELECT CEIL(COUNT(*)/ 20) AS paginas FROM deudas", (err, pages) => {
          if (err) {
            reject(err);
          } else {
            // calcular el valor total de cada deuda
            conexion.query("select id_deuda from deudas where id_usuario = ?", [id], (err, user) => {
              if (err) {
                reject(err.message);
              } else {
              // se recojen las identificaciones
                const idUsuarios = [0];
                for (const i in user) {
                  idUsuarios.push(user[i].id_deuda);
                }
                conexion.query(`select id_deuda, sum(valor) as total
                from(
                select id_deuda, valor from suma_deuda
                union all
                select id_deuda, valor from abonos
                )as id_deuda
                where id_deuda in (${idUsuarios})
                group by id_deuda`, (err, valorTotal) => {
                  if (err) {
                    reject(err.message);
                  } else {
                    // sumatoria de todos los valores
                    const valorT = [];
                    for (const i in valorTotal) {
                      valorT.push(valorTotal[i].total);
                    }
                    const resultValor = valorT.reduce((a, b) => {
                      return a + b;
                    }, 0);
                    resolve({ success: true, data: { data: result, totalDeudas: resultValor }, paginas: pages[0] });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
};

const DeletedeudaDB = (id) => {
  return new Promise((resolve, reject) => {
    conexion.query("DELETE FROM deudas WHERE id_deuda=?", [id], (err, result) => {
      if (err) {
        const err1 = err;
        reject(err1);
      } else {
        resolve(result);
      }
    });
  });
};

const UpdatedeudaDB = (updateCustomer) => {
  const { nombre, idCredito, fecha, celular } = updateCustomer;
  return new Promise((resolve, reject) => {
    conexion.query("UPDATE deudas SET nombre =?, celular =?, fecha =? WHERE id_deuda=?", [nombre, celular, fecha, idCredito], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

const CreatedeudaDB = (customer) => {
  const { idUsuario, nombre, celular, date } = customer;

  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM deudas WHERE nombre =?", [nombre], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (!result.length <= 0) {
          resolve(false);
        } else {
          conexion.query("INSERT INTO deudas SET ?", [{ nombre, celular, id_usuario: idUsuario, fecha: date }], (err, row) => {
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

const findDeudaDB = (id, words) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from deudas where nombre like ? and id_usuario =? ", [`%${words}%`, id], (err, result) => {
      if (err) {
        reject(err);
        console.log("error")
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
  GetAlldeudaDB,
  DeletedeudaDB,
  UpdatedeudaDB,
  CreatedeudaDB,
  findDeudaDB
};
