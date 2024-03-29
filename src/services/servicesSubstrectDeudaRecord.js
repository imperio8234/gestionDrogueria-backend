const conexion = require("../toolsDev/midelware/bd_conection");

const GetAllsubtractDeudaRecordDB = (id, pagina) => {
  const page = (pagina - 1) * 20;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM abonos WHERE id_deuda =? LIMIT 20 OFFSET ?", [id, page], (err, result) => {
      if (err) {
        reject(err);
      }
      conexion.query("SELECT CEIL(COUNT(*)/ 20) AS paginas FROM abonos", (err, pages) => {
        if (err) {
          reject(err);
        } else {
          resolve({ success: true, data: result, paginas: pages[0] });
        }
      });
    });
  });
};
const updatesubtractDeudaRecordDB = (data) => {
  const { fecha, valor, idRecord } = data;
  return new Promise((resolve, reject) => {
    conexion.query("UPDATE abonos SET fecha =?, valor =? WHERE id_abono=?", [fecha, valor, idRecord], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
const deletesubtractDeudaRecordDB = (id) => {
  return new Promise((resolve, reject) => {
    conexion.query("DELETE FROM abonos WHERE id_abono=?", [id], (err, result) => {
      if (err) {
        const err1 = err;
        reject(err1);
      } else {
        resolve(result);
      }
    });
  });
};
const createsubtractDeudaRecordDB = (record) => {
  const { fecha, valor, idDeuda } = record;

  return new Promise((resolve, reject) => {
    conexion.query("select valor from suma_deuda where id_deuda=?", [{ id_deuda: idDeuda }], (err, valoresCredito) => {
      if (err) {
        reject(err.message);
      } else {
        const valores = [].concat(...valoresCredito.map(valor => valor));
        if (valores.reduce((a, b) => a + b, 0) <= 0) {
          resolve({ success: false, message: "no tienes pendientes" });
        } else if (valor <= valores) {
          resolve({ success: false, message: "el valor excede el credito" });
        } else {
          conexion.query("INSERT INTO abonos SET ?", [{ fecha, valor, id_deuda: idDeuda }], (err, row) => {
            if (err) {
              reject(err.message);
            } else {
              resolve({ success: true });
            }
          });
        }
      }
    });
  }
  );
};

module.exports = {
  createsubtractDeudaRecordDB,
  deletesubtractDeudaRecordDB,
  updatesubtractDeudaRecordDB,
  GetAllsubtractDeudaRecordDB
};
