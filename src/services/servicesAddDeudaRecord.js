const conexion = require("../toolsDev/midelware/bd_conection");

const GetAllDeudaDB = (id, pagina) => {
  const page = (pagina - 1) * 20;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM suma_deuda WHERE id_deuda =? LIMIT 20 OFFSET ?", [id, page], (err, result) => {
      if (err) {
        reject(err);
      }
      conexion.query("SELECT CEIL(COUNT(*)/ 20) AS paginas FROM suma_deuda", (err, pages) => {
        if (err) {
          reject(err);
        } else {
          resolve({ success: true, data: result, paginas: pages[0] });
        }
      });
    });
  });
};

const DeleteDeudaDB = (id) => {
  return new Promise((resolve, reject) => {
    conexion.query("DELETE FROM suma_deuda WHERE id_suma=?", [id], (err, result) => {
      if (err) {
        const err1 = err;
        reject(err1);
      } else {
        resolve(result);
      }
    });
  });
};

const UdateDeudaDB = (data) => {
  const { fecha, producto, valor, idDeuda } = data;
  return new Promise((resolve, reject) => {
    conexion.query("UPDATE suma_deuda SET fecha =?, producto =?, valor =? WHERE id_suma=?", [fecha, producto, valor, idDeuda], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

const CreateDeudaDB = (Deuda) => {
  const { fecha, producto, valor, idDeuda } = Deuda;

  return new Promise((resolve, reject) => {
    conexion.query("INSERT INTO suma_deuda SET ?", [{ fecha, producto, valor, id_deuda: idDeuda }], (err, row) => {
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
  GetAllDeudaDB,
  DeleteDeudaDB,
  UdateDeudaDB,
  CreateDeudaDB
};
