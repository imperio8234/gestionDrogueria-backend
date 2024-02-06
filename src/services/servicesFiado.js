const conexion = require("../toolsDev/midelware/bd_conection");
const crearFiadoDB = (gasto) => {
  const { idFiado, idUsuario, descripcion, valorFiado, fecha } = gasto;
  return new Promise((resolve, reject) => {
    conexion.query("insert into gastos (id_fiado, id_usuario, descripcion, valor, fecha) VALUES (?,?,?,?,?,?)",
      [idFiado, idUsuario, descripcion, valorFiado, fecha], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const modificarFiadoDB = (idUsuario, data) => {
  const query = `
  update fiado 
  set descripcion = CASE 
              WHEN ? <> '' THEN ?
              ELSE descripcion
                    END,
      valor = CASE
                        WHEN ? <> '' THEN ?
                        ELSE valor
                    END
    where id_usuario =? and id_fiado = ?;

  `;
  const { descripcion, valorFiado, id } = data;
  return new Promise((resolve, reject) => {
    conexion.query(query,
      [descripcion, descripcion, valorFiado, valorFiado, idUsuario, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const optenerFiadoDB = (idUsuario, idCredito, fecha) => {
  const año = fecha.split("y")[1];
  const mes = fecha.split("y")[0];
  return new Promise((resolve, reject) => {
    conexion.query(`select * from gastos where id_usuario = ? and id_credito = ?
     and month(STR_TO_DATE(fecha, '%d/%m/%Y')) in(${mes})
     and
     STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '${año}-01-01' AND '${año}-12-31' 
     group by categoria`, [idUsuario, idCredito], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const eliminarFiadoDB = (idFiado, idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("delete from fiado where id_fiado =? and id_usuario =?", [idFiado, idUsuario], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  crearFiadoDB,
  modificarFiadoDB,
  optenerFiadoDB,
  eliminarFiadoDB

};
