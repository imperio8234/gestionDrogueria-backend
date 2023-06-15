const conexion = require("../toolsDev/midelware/bd_conection");

const GetAllsubtractCreditRecordDB = (id) => {
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM abonos_credito WHERE id_credito=? ", [id], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
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
