const conexion = require("../toolsDev/midelware/bd_conection");

const GetAllsubtractCreditRecordDB = (id, pagina) => {
  const page = (pagina - 1) * 20;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM abonos_credito WHERE id_credito =? LIMIT 20 OFFSET ?", [id, page], (err, result) => {
      if (err) {
        reject(err);
      }
      conexion.query("SELECT CEIL(COUNT(*)/ 20) AS paginas FROM abonos_credito where id_credito = ?", [id],(err, pages) => {
        if (err) {
          reject(err);
        } else {
          resolve({ success: true, data: result, paginas: pages[0] });
        }
      });
    });
  });
};
const updatesubtractCreditRecordDB = (data) => {
  const { valor, idRecord } = data;
  return new Promise((resolve, reject) => {
    conexion.query("UPDATE abonos_credito SET valor =? WHERE id_abono=?", [valor, idRecord], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
const deletesubtractCreditRecordDB = (id) => {
  return new Promise((resolve, reject) => {
    conexion.query("DELETE FROM abonos_credito WHERE id_abono=?", [id], (err, result) => {
      if (err) {
        const err1 = err;
        reject(err1);
      } else {
        resolve(result);
      }
    });
  });
};
const createsubtractCreditRecordDB = (record, idUsuario) => {
  const { fecha, valor, idCredito } = record;
  const valor2 = parseInt(valor)
  return new Promise((resolve, reject) => {
    conexion.query("select valor from suma_credito where id_credito=? and id_usuario = ?", [idCredito, idUsuario], (err, valoresCredito) => {
      if (err) {
        reject(err.message);
      } else {
        conexion.query("select valor from abonos_credito where id_credito=? and id_usuario = ?", [idCredito, idUsuario], (err, valoresAbonos) => {
          if (err) {
            reject(err);
          } else {
            conexion.query(`
             select 
              sum(valor) valor
             from
              creditosf
             where 
              id_usuario = ?
            `, [idUsuario], (err, abonosCref) => {
              if (err) {
                reject(err);
                return;
              }
              const valores = [].concat(...valoresCredito.map(valor => parseInt(valor.valor)));
            const valores2 = [].concat(...valoresAbonos.map(valor => parseInt(valor.valor)));
            const totales1 = valores.reduce((a, b) => a + b, 0);
            const totales2 = valores2.reduce((a, b) => a + b, 0);
            const creditosf = parseInt(abonosCref[0].valor)
            if ((creditosf + totales1) - totales2 <= 0) {
              resolve({ success: false, message: "no tienes pendientes" });
            } else if (valor2 > (creditosf + totales1)) {
              resolve({ success: false, message: "su abono excede el credito" });
            } else {
              conexion.query("INSERT INTO abonos_credito SET ?", [{ fecha, valor:valor2, id_credito: idCredito, id_usuario: idUsuario }], (err, row) => {
                if (err) {
                  reject(err.message);
                } else {
                  resolve({ success: true });
                }
              });
            }

            })
          }
        });
      }
    });
  }
  );
};

module.exports = {
  createsubtractCreditRecordDB,
  deletesubtractCreditRecordDB,
  updatesubtractCreditRecordDB,
  GetAllsubtractCreditRecordDB
};
