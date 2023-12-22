const conexion = require("../toolsDev/midelware/bd_conection");

const GetAllsubtractDeudaRecordDB = (id, pagina) => {
  const page = (pagina - 1) * 20;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM abonos WHERE id_deuda =? order by id_abono DESC LIMIT 20 OFFSET ?", [id, page], (err, result) => {
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
  const { fecha, valor, idDeuda, idUsuario } = record;
  return new Promise((resolve, reject) => {
    conexion.query(`
    (
      SELECT 
      (IFNULL(SUM(costo * unidades), 0) - IFNULL((SELECT SUM(valor) FROM abonos WHERE id_deuda = ? AND id_usuario = ?), 0))  totalAbonos
  FROM 
      productos_historial 
  WHERE 
      id_deuda = ? AND metodo_pago = "compra a credito"
  
    )
    `, [idDeuda, idUsuario, idDeuda, idUsuario], (err, valores) => {
      if (err) {
        reject(err.message);
      } else {
        if (parseInt(valor) > valores[0].totalAbonos) {
          resolve({ success: false, message: `solo tienes que pagar ${valores[0].totalAbonos}` });
        } else {
          conexion.query("INSERT INTO abonos SET ?", [{ fecha, valor, id_deuda: idDeuda, id_usuario: idUsuario }], (err, row) => {
            if (err) {
              reject(err.message);
            } else {
              resolve({ success: true });
            }
          });
        }
      }
    });
  });
};

module.exports = {
  createsubtractDeudaRecordDB,
  deletesubtractDeudaRecordDB,
  updatesubtractDeudaRecordDB,
  GetAllsubtractDeudaRecordDB
};
