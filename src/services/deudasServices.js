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
            select 
              id_deuda, 
              ifnull(sum(costo * unidades), 0) compras 
            from 
              productos_historial 
              where 
              id_usuario = ?
              and 
              metodo_pago = "compra a credito"
            group by id_deuda

                 `, [idUsuario], (err, compras) => {
              if (err) {
                reject(err.message);
              } else {
                conexion.query(`
                select 
                 id_deuda, 
                 ifnull(sum(valor), 0) abonos 
                from 
                 abonos 
                where
                 id_usuario = ?
                group by id_deuda
                `, [idUsuario], (err, abonos) => {
                  if (err) {
                    reject(err);
                  }
                  conexion.query(`
                    select 
                     sum(valor) valor,
                     id_deuda
                    from
                     compras_fuera_inventario
                    where 
                     id_usuario = ?
                    and 
                     metodo_pago = "compra a credito"
                     group by id_deuda
                    `, [idUsuario], (err, vCompraf) => {
                      if (err) {
                        reject(err);
                        return;
                      }
                      resolve({ success: true, data: result, compras, abonos, paginas: pages[0], vCompraf });

                    })
                });
              }
            });
          }
        });
      }
    });
  });
};

/**
 *
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
               group by id_deuda} id
 */
const DeletedeudaDB = (id) => {
  return new Promise((resolve, reject) => {
    conexion.query(
      `
      DELETE deudas, abonos, productos_historial
      FROM deudas
      LEFT JOIN abonos ON deudas.id_deuda = abonos.id_deuda
      LEFT JOIN productos_historial ON deudas.id_deuda = productos_historial.id_deuda
      WHERE deudas.id_deuda = ?
      `,
      [id],
      (err, result) => {
        if (err) {
          const err1 = err;
          reject(err1);
        } else {
          resolve(result);
        }
      }
    );
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
    conexion.query("SELECT * FROM deudas WHERE nombre =? and id_usuario = ?", [nombre, idUsuario], (err, result) => {
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
