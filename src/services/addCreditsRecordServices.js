const conexion = require("../toolsDev/midelware/bd_conection");

const GetAllRecordDB = (id, pagina) => {
  const page = (pagina - 1) * 20;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM suma_credito WHERE id_credito =? LIMIT 20 OFFSET ?", [id, page], (err, result) => {
      if (err) {
        reject(err);
      }
      conexion.query("SELECT CEIL(COUNT(*)/ 20) AS paginas FROM suma_credito", (err, pages) => {
        if (err) {
          reject(err);
        } else {
          resolve({ success: true, data: result, paginas: pages[0] });
        }
      });
    });
  });
};

const DeleteRecordDB = (id) => {
  return new Promise((resolve, reject) => {
    conexion.query("DELETE FROM suma_credito WHERE id_suma=?", [id], (err, result) => {
      if (err) {
        const err1 = err;
        reject(err1);
      } else {
        resolve(result);
      }
    });
  });
};

const UdateRecordDB = (data) => {
  const { fecha, producto, valor, idRecord } = data;
  return new Promise((resolve, reject) => {
    conexion.query("UPDATE suma_credito SET fecha =?, producto =?, valor =? WHERE id_suma=?", [fecha, producto, valor, idRecord], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

const CreateRecordDB = (record) => {
  const { fecha, producto, valor, idCredito } = record;

  return new Promise((resolve, reject) => {
    conexion.query("INSERT INTO suma_credito SET ?", [{ fecha, producto, valor, id_credito: idCredito }], (err, row) => {
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
  GetAllRecordDB,
  DeleteRecordDB,
  UdateRecordDB,
  CreateRecordDB
};
