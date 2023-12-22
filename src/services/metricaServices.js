const conexion = require("../toolsDev/midelware/bd_conection");
const getProductosMetricaDB = (idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from productos where id_usuario =?", [idUsuario], (err, low) => {
      if (err) {
        reject(err.message);
      } else {
        if (low.length <= 0) {
          resolve({ success: false, message: "no hay registros" });
        } else {
          resolve({ success: true, low });
        }
      }
    });
  });
};
const getcreditosMetricaDB = (idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from creditos where id_usuario =?", [idUsuario],
      (err, clientesdb) => {
        if (err) {
          reject(err);
        } else {
          // verificar si hay clientes resgistrados
          if (clientesdb.length <= 0) {
            resolve({ success: false });
          } else {
            const clientes = [];
            clientesdb.map(cliente => clientes.push(cliente.id_credito));
            conexion.query(`select * from suma_credito where id_credito in (${clientes})`,
              (err, sumas) => {
                if (err) {
                  reject(err);
                } else {
                  conexion.query(`select * from abonos_credito where id_credito in (${clientes})`,
                    (err, abonos) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve({ success: true, abonos, sumas, clientesdb });
                      }
                    });
                }
              });
          }
        }
      });
  });
};
const getdeudasMetricaDB = (idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from deudas where id_usuario =?", [idUsuario],
      (err, deudasdb) => {
        if (err) {
          reject(err);
        } else {
          // verificar si hay clientes resgistrados
          if (deudasdb.length <= 0) {
            resolve({ success: false });
          } else {
            const deudas = [];
            deudasdb.map(deuda => deudas.push(deuda.id_credito));
            conexion.query(`select * from suma_deuda where id_credito in (${deudas})`,
              (err, sumas) => {
                if (err) {
                  reject(err);
                } else {
                  conexion.query(`select * from abonos where id_credito in (${deudas})`,
                    (err, abonos) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve({ success: true, abonos, sumas, deudasdb });
                      }
                    });
                }
              });
          }
        }
      });
  });
};

const getCompras = (usuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("select distinct fecha, distribuidor from productos_historial where id_usuario =?", [usuario], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const filterCompras = () => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from productos_historial where fecha = ? and id_usuario = ? and distribuidor = ?", [], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const optenerComprasYventasDB = (idUsuario, mes) => {
  const query = `
  SELECT

  IFNULL(ph2.compras_sin_pagar, 0) AS compras_sin_pagar,
  IFNULL(ph.compras_totales, 0) AS compras_totales,
  IFNULL(SUM(v.total_venta), 0) AS total_venta,
  IFNULL(pv.total_ganancia, 0) AS total_ganancia,
  IFNULL(g.valor_gasto, 0) AS valor_gasto,
  IFNULL(dc.deuda_creditos, 0) AS deuda_creditos,
  IFNULL(dc.creditos_pagos, 0) AS creditos_pagos

FROM
ventas v,
(
select 
   sum((costo * unidades)) compras_totales 
from 
   productos_historial
where 
   id_usuario = ? and  date_format(STR_TO_DATE(fecha, '%d/%m/%y'), '%m') in (${mes})
) ph,
 (
  SELECT
         SUM(((pv.valor - pv.costo_un) * pv.cantidad)) AS total_ganancia
     FROM
         productos_vendidos pv
         left join ventas v on v.id_venta = pv.id_venta 
     WHERE
         pv.id_usuario = ? and  date_format(STR_TO_DATE(fecha, '%d/%m/%y'), '%m') in (${mes})
 ) AS pv,
 (
     SELECT
         SUM(valor_gasto) AS valor_gasto
     FROM
         gastos
     WHERE
         id_usuario = ? and  date_format(STR_TO_DATE(fecha, '%d/%m/%y'), '%m') in (${mes})
 ) AS g,
 (
     SELECT
         SUM(ac.valor) AS creditos_pagos,
         (SUM(ac.valor) - (
             SELECT
                 SUM(valor)
             FROM
                 suma_credito
             WHERE
                 id_usuario = ? and  date_format(STR_TO_DATE(fecha, '%d/%m/%y'), '%m') in (${mes})
         )) AS deuda_creditos
     FROM
         abonos_credito ac
     WHERE
         ac.id_credito IN (
             SELECT
                 id_credito
             FROM
                 creditos
             WHERE
                 id_usuario = ? and  date_format(STR_TO_DATE(fecha, '%d/%m/%y'), '%m') in (${mes})
         )
 ) AS dc,
 (select 
  (IFNULL((select sum(valor) from abonos where id_usuario = ? and  date_format(STR_TO_DATE(fecha, '%d/%m/%y'), '%m') in (${mes})), 0) - sum((costo * unidades)) ) compras_sin_pagar
from 
   productos_historial 
where 
   id_usuario = ? and metodo_pago = "compra a credito" and  date_format(STR_TO_DATE(fecha, '%d/%m/%y'), '%m') in (${mes})
) ph2

WHERE
v.id_usuario = ? and  date_format(STR_TO_DATE(v.fecha, '%d/%m/%y'), '%m') in (${mes})
GROUP BY
 total_ganancia,
 valor_gasto,
 deuda_creditos,
 compras_sin_pagar,
 compras_totales;
  `;
  return new Promise((resolve, reject) => {
    conexion.query(query,
      [
        idUsuario,
        idUsuario,
        idUsuario,
        idUsuario,
        idUsuario,
        idUsuario,
        idUsuario,
        idUsuario
      ],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const exportarDB = (fecha, idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from ventas where fecha = ? and id_usuario =?", [fecha, idUsuario], (err, res) => {
      if (err) {
        resolve(err);
      } else {
        reject(res);
      }
    });
  });
};
module.exports = {
  getProductosMetricaDB,
  getcreditosMetricaDB,
  getdeudasMetricaDB,
  getCompras,
  filterCompras,
  optenerComprasYventasDB,
  exportarDB
};
