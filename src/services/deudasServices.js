const conexion = require("../toolsDev/midelware/bd_conection");

const GetAlldeudaDB = (idUsuario, pagina) => {
  const page = (pagina - 1) * 20;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM deudas WHERE id_usuario =? LIMIT 20 OFFSET ?", [idUsuario, page], (err, result) => {
      if (err) {
        reject(err);
      } else {
        conexion.query("SELECT CEIL(COUNT(*)/ 20) AS paginas FROM deudas", (err, pages) => {
          if (err) {
            reject(err);
          } else {
            // calcular el valor total de cada deuda
            // se recojen las identificaciones
            conexion.query(`
             SELECT
               distinct ph.id_deuda,
               (IFNULL(sum(ph.costo * ph.unidades) , 0) -  IFNULL(abonos_suma.saldo_pendiente, 0))  total_abonos
                 FROM
                   productos_historial ph
                 LEFT JOIN (
             SELECT
               id_deuda,
               SUM(valor)  saldo_pendiente
             FROM
               abonos
             WHERE
               id_usuario = ?
             GROUP BY
               id_deuda
               ) abonos_suma ON ph.id_deuda = abonos_suma.id_deuda
               WHERE
                   ph.id_usuario = ?
               AND ph.metodo_pago = "compra a credito"
               group by id_deuda
                 `, [idUsuario, idUsuario], (err, valorTotal) => {
              if (err) {
                reject(err.message);
              } else {
                // sumatoria de todos los valores
                resolve({ success: true, data: { data: result, saldoPendiente: valorTotal }, paginas: pages[0] });
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
