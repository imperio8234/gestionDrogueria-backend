const conexion = require("../toolsDev/midelware/bd_conection");

const GetAllsubtractCreditRecordDB = (id, pagina) => {
  const page = (pagina - 1) * 20;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM abono_credito WHERE id_credito =? LIMIT 20 OFFSET ?", [id, page], (err, result) => {
      if (err) {
        reject(err);
      }
      conexion.query("SELECT CEIL(COUNT(*)/ 20) AS paginas FROM abono_credito", (err, pages) => {
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
  const { fecha, valor, idRecord } = data;
  return new Promise((resolve, reject) => {
    conexion.query("UPDATE abonos_credito SET fecha =?, valor =? WHERE id_abono=?", [fecha, valor, idRecord], (err, row) => {
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
const createsubtractCreditRecordDB = (record) => {
  const { fecha, valor, idCredito } = record;

  return new Promise((resolve, reject) => {
    conexion.query("INSERT INTO abonos_credito SET ?", [{ fecha, valor, id_credito: idCredito }], (err, row) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(true);
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
