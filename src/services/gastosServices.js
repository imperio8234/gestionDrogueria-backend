const conexion = require("../toolsDev/midelware/bd_conection");
const crearGastosDB = (gasto) => {
  const { idGasto, idUsuario, descripcion, valorGasto, categoria, fecha } = gasto;
  const fechaFormat = fecha.split("-").reverse().join("/");

  return new Promise((resolve, reject) => {
    conexion.query("insert into gastos (id_gasto, id_usuario, descripcion, valor_gasto, fecha, categoria) VALUES (?,?,?,?,?,?)",
      [idGasto, idUsuario, descripcion, valorGasto, fechaFormat, categoria], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const modificarGastosDB = (idUsuario, data) => {
  const query = `
  update gastos 
  set descripcion = CASE 
              WHEN ? <> '' THEN ?
              ELSE descripcion
                    END,
      valor_gasto = CASE
                        WHEN ? <> '' THEN ?
                        ELSE valor_gasto
                    END,
      categoria = CASE
                      WHEN ? <> '' THEN ?
                      ELSE categoria
                  END
    where id_usuario =? and id_gasto = ?;

  `;
  const { descripcion, valorGasto, categoria, id } = data;
  return new Promise((resolve, reject) => {
    conexion.query(query,
      [descripcion, descripcion, valorGasto, valorGasto, categoria, categoria, idUsuario, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const optenerGastosDB = (idUsuario, fecha) => {
  const año = fecha.split("y")[1];
  const mes = fecha.split("y")[0];
  return new Promise((resolve, reject) => {
    conexion.query(`select categoria, sum(valor_gasto) valorTotal from gastos where id_usuario = ?
     and month(STR_TO_DATE(fecha, '%d/%m/%Y')) in(${mes})
     and
     STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '${año}-01-01' AND '${año}-12-31' 
     group by categoria`, [idUsuario], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const eliminarGastosDB = (idGasto, idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("delete from gastos where id_gasto =? and id_usuario =?", [idGasto, idUsuario], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
const detallesGastosDB = (categoria, mes, idUsuario) => {
  const regex = /[-]/g;
  // validar si solo es el mes o la fecha completa para filtrar
  return new Promise((resolve, reject) => {
    if (!regex.test(mes)) {
      // solo el mes
      conexion.query("select * from gastos where month(STR_TO_DATE(fecha, '%d/%m/%Y')) = ? and categoria =? and id_usuario =?;", [mes, categoria, idUsuario], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }
    // fecha completa para filtrado
    let fechaFormaeada = mes.split("-");
    fechaFormaeada = `${fechaFormaeada[2]}/${fechaFormaeada[1]}/${fechaFormaeada[0]}`;
    conexion.query("select * from gastos where fecha = ? and categoria =? and id_usuario =?;", [fechaFormaeada, categoria, idUsuario], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  crearGastosDB,
  modificarGastosDB,
  optenerGastosDB,
  eliminarGastosDB,
  detallesGastosDB

};
