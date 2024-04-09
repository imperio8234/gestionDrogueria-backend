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

const optenerComprasYventasDB = (idUsuario, fecha) => {
  const año = fecha.split("y")[1];
  const mes = fecha.split("y")[0];

  return new Promise((resolve, reject) => {
    conexion.query(`
    select 
      (ifnull(sum((costo * unidades)), 0) + (select ifnull(sum(valor), 0) valor from  compras_fuera_inventario where id_usuario = ? ;
      )) compras_totales
    from 
      productos_historial
    where 
      id_usuario = ? and  date_format(STR_TO_DATE(fecha, '%d/%m/%y'), '%m') in (${mes})
    and 
      STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '${año}-01-01' AND '${año}-12-31'
    `,
    [idUsuario],
    (err, compras) => {
      if (err) {
        reject(err);
      }
      conexion.query(`
        
   select
     (
      (ifnull(sum(costo * unidades), 0) 
     + 
       (select 
         ifnull(sum(valor), 0) valor 
       from  
         compras_fuera_inventario
       where 
          id_usuario = ?
         and 
          metodo_pago = "compra a credito")
         )
          -
          (select 
            ifnull(sum(valor), 0) valor
          from
            abonos
          where 
           id_usuario = ? )) valor
   from 
    productos_historial 
   where 
     metodo_pago = "compra a credito"
     and id_usuario = ?
        `,
      [idUsuario, idUsuario, idUsuario, idUsuario],
      (err, comprasSinPagar) => {
        if (err) {
          reject(err);
        }
        conexion.query(`
              SELECT
                  ifnull(SUM(valor_gasto), 0) AS valor_gasto
              FROM
                  gastos
              WHERE
                  id_usuario = ? and  date_format(STR_TO_DATE(fecha, '%d/%m/%y'), '%m') in (${mes})
                  and 
         STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '${año}-01-01' AND '${año}-12-31'
            `,
        [idUsuario],
        (err, gastos) => {
          if (err) {
            reject(err);
          }
          conexion.query(`
                SELECT
                ifnull((ifnull(sum(sc.valor),0) + ifnull((select sum(valor) from  creditosf where id_usuario = ?),0) ) - abonos.valor, 0) saldoCreditos ,
                ifnull(abonos.valor, 0) abonos
               FROM
                  suma_credito sc,
                  (select ifnull(sum(valor), 0) valor from abonos_credito where id_credito IN (
                       SELECT
                           id_credito
                       FROM
                           creditos
                       WHERE
                           id_usuario = ?
                          
                   )
                   ) abonos
               WHERE
                   sc.id_credito IN (
                       SELECT
                           id_credito
                       FROM
                           creditos
                       WHERE
                           id_usuario = ?
                   )
                          group by abonos.valor   
                   ;
                `,
          [idUsuario, idUsuario, idUsuario],
          (err, creditos) => {
            if (err) {
              reject(err);
            }
            conexion.query(`
                    SELECT
                    ifnull(sum(v.total_venta), 0) total_venta,
                     ifnull(SUM(((pv.valor - pv.costo_un) * pv.cantidad)), 0) AS total_ganancia
                 FROM
                     ventas v
                     left join productos_vendidos pv on pv.id_venta = v.id_venta
                 WHERE
                     v.id_usuario = ? and  date_format(STR_TO_DATE(v.fecha, '%d/%m/%y'), '%m') in (${mes})
                     and 
                     STR_TO_DATE(v.fecha, '%d/%m/%Y') BETWEEN '${año}-01-01' AND '${año}-12-31'
             ;   
                    `, [idUsuario], (err, ventas) => {
              if (err) {
                reject(err);
              }
              conexion.query(`
              select 
              ifnull(sum(valor), 0) - ifnull((select
                       sum(valor) 
                      from  
                       abonos_credito 
                      where 
                       id_usuario = ?),0) valor
             from 
               creditosf 
             where 
               id_usuario = ?
               ;
               
              `, [idUsuario, idUsuario], (err, creditosf) => {

              })

              resolve({ comprasSinPagar, compras, ventas, gastos, creditos });
            });
          });
        });
      });
    });
  });
};

const exportarDB = (fecha, idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query(`
    select 
   p.producto, 
   p.cantidad, 
   p.laboratorio, 
   p.porcentageIva IVA, 
   p.valor_total valorProductos, 
   p.valor precio, 
   p.costo_un costo
  from 
    productos_vendidos p
      left join ventas v on v.id_venta = p.id_venta
      where v.fecha = ? and v.id_usuario = ?
    `, [fecha, idUsuario], (err, res) => {
      if (err) {
        reject(err);
      }

      // peticion de gastos
      conexion.query(`
      select categoria, (sum(valor_gasto)) valor from gastos
        where fecha = ? and id_usuario = ?
        group by categoria
      `, [fecha, idUsuario], (err, gasto) => {
        if (err) {
          reject(err);
        }
        resolve({ ventas: res, gastos: gasto });
      });
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

/**
 *
 *   SELECT

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
   and
STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '${año}-01-01' AND '${año}-12-31'
) ph,
 (
  SELECT
         SUM(((pv.valor - pv.costo_un) * pv.cantidad)) AS total_ganancia
     FROM
         productos_vendidos pv
         left join ventas v on v.id_venta = pv.id_venta
     WHERE
         pv.id_usuario = ? and  date_format(STR_TO_DATE(fecha, '%d/%m/%y'), '%m') in (${mes})
         and
STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '${año}-01-01' AND '${año}-12-31'
 ) AS pv,
 (
     SELECT
         SUM(valor_gasto) AS valor_gasto
     FROM
         gastos
     WHERE
         id_usuario = ? and  date_format(STR_TO_DATE(fecha, '%d/%m/%y'), '%m') in (${mes})
         and
STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '${año}-01-01' AND '${año}-12-31'
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
                 and
STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '${año}-01-01' AND '${año}-12-31'
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
                 and
STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '${año}-01-01' AND '${año}-12-31'
         )
 ) AS dc,
 (select
  (IFNULL((select sum(valor) from abonos where id_usuario = ? and  date_format(STR_TO_DATE(fecha, '%d/%m/%y'), '%m') in (${mes})
  and
   STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '${año}-01-01' AND '${año}-12-31'
  ), 0) - sum((costo * unidades)) ) compras_sin_pagar
from
   productos_historial
where
   id_usuario = ? and metodo_pago = "compra a credito" and  date_format(STR_TO_DATE(fecha, '%d/%m/%y'), '%m') in (${mes})
   and
STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '${año}-01-01' AND '${año}-12-31'
) ph2

WHERE
v.id_usuario = ? and  date_format(STR_TO_DATE(v.fecha, '%d/%m/%y'), '%m') in (${mes})
and
STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '${año}-01-01' AND '${año}-12-31'
GROUP BY
 total_ganancia,
 valor_gasto,
 deuda_creditos,
 compras_sin_pagar,
 compras_totales;
 */
