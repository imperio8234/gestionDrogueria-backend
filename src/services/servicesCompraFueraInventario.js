const conexion = require("../toolsDev/midelware/bd_conection");
const crearComprafDB = (gasto) => {
  const { idCompraf, idUsuario, descripcion, valorCompraf, fecha, idDeuda } = gasto;
  return new Promise((resolve, reject) => {
    conexion.query("insert into compras_fuera_inventario (id_compra, id_usuario, descripcion, valor, fecha, id_deuda) VALUES (?,?,?,?,?,?)",
      [idCompraf, idUsuario, descripcion, valorCompraf, fecha, idDeuda], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const modificarComprafDB = (idUsuario, data) => {
  const query = `
  update compras_fuera_inventario 
  set descripcion = CASE 
              WHEN ? <> '' THEN ?
              ELSE descripcion
                    END,
      valor = CASE
                        WHEN ? <> '' THEN ?
                        ELSE valor
                    END
    where id_usuario =? and id_compra = ?;

  `;
  const { descripcion, valorCompraf, id } = data;
  return new Promise((resolve, reject) => {
    conexion.query(query,
      [descripcion, descripcion, valorCompraf, valorCompraf, idUsuario, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const optenerComprafDB = (idUsuario, fecha, idDeuda, pagina) => {
  const año = fecha.split("-")[0];
  const mes = fecha.split("-")[1];
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  const consultaFecha = `
  select * from compras_fuera_inventario where id_usuario = ? and id_deuda = ?
     and month(STR_TO_DATE(fecha, '%d/%m/%Y')) in(${mes})
     and
     STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '${año}-01-01' AND '${año}-12-31' 
  `;

  const consultaSinFecha = `
  select * from compras_fuera_inventario where id_usuario = ? and id_deuda = ?
  `;
  return new Promise((resolve, reject) => {
    conexion.query(regex.test(fecha) ? consultaFecha : consultaSinFecha, [idUsuario, idDeuda], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const eliminarComprafDB = (idCompraf, idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("delete from compras_fuera_inventario where id_compra =? and id_usuario =?", [idCompraf, idUsuario], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
module.exports = {
  crearComprafDB,
  modificarComprafDB,
  optenerComprafDB,
  eliminarComprafDB

};
