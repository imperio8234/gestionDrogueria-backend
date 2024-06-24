const getDate = require("../toolsDev/getDate");
const conexion = require("../toolsDev/midelware/bd_conection");
const { creditosf, comprasTotsales, abonosCredito, abonosCompras, comprasfSinPagar } = require("./queryBdMetricas");
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
      ifnull(sum((costo * unidades)), 0) compras_totales
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
     ifnull(sum(costo * unidades),0 ) valor
   from 
    productos_historial 
   where 
     metodo_pago = "compra a credito"
     and id_usuario = ?
        `,
      [idUsuario, idUsuario],
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
                ifnull(sum(valor), 0) valor
               FROM
                  suma_credito
               WHERE
                   id_usuario = ?        
                   ;
                `,
          [idUsuario],
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

              // optener creditos fuera de inventario
               conexion.query(creditosf, [idUsuario], (err, creditof) => {
                if (err) {
                  reject(err);
                  return
                }
                // optener compras fuera de inventario
                conexion.query(comprasTotsales, [idUsuario], (err, comprasTotalesV) => {
                  if (err) {
                    reject(err);
                    return
                  }
                 // optener compras sin pagar
                  conexion.query(comprasfSinPagar, [idUsuario], (err, comprasNoPagas) => {
                    if (err) {
                      reject(err);
                      return
                    }
                    // optener abonos de creditos 
                    conexion.query(abonosCredito, [idUsuario], (err, abonoC) => {
                      if (err) {
                        reject(err);
                        return
                      }
                      //optener abonos compras
                      conexion.query(abonosCompras, [idUsuario], (err, abonoCom) => {
                        if (err) {
                          reject(err);
                          return
                        }
                        // envio de informacion 
                        resolve({ 
                          comprasSinPagar, 
                          compras, 
                          ventas, 
                          gastos, 
                          creditos,
                          comprasTotalesV, 
                          comprasNoPagas, 
                          abonoC, 
                          abonoCom,
                          creditof });
                       });
                     });
                   });
                 });
               });
            });
          });
        });
      });
    });
  });
};

const exportarDB = (fecha, idUsuario) => {
  const fechasSinDuplicados = getDate(fecha);
 return new Promise((resolve, reject) => {
    conexion.query(`
    select 
     sum(valor_gasto) totalGastos
    from 
     gastos 
    where 
      id_usuario = ? 
     and 
      fecha =?;
    `, [idUsuario, fechasSinDuplicados], (err, gastos) => {
      if (err) {
        reject(err);
        return;
      }
      
      conexion.query(`
      select
        sum(valor) valorCompras
     from
       compras_fuera_inventario
     where 
      id_usuario = ?
    and
      fecha =? 
    and 
      metodo_pago = "pago de contado"
    and 
     procedencia = "caja"     
      `, [idUsuario, fechasSinDuplicados], (err, compras) => {
        if (err) {
          reject(err)
          return;
        }
        conexion.query(`
        select 
         sum(valor) valorCreditosF
        from 
         creditosf
        where
         id_usuario = ?
        and
         fecha =?
        `, [idUsuario, fechasSinDuplicados], (err, creditosf) => {
          if(err){
            reject(err)
            return;
          }
          conexion.query(`
           select 
            sum(valor) valorAbonosCredito
           from 
            abonos_credito
          where
          fecha =?
           and 
           id_usuario = ?

          `, [fechasSinDuplicados, idUsuario], (err, abonosCredito) => {
            if (err) {
              reject(err);
              return;
            }
            conexion.query(`
            select
             sum(valor) valorAbonos
            from 
             abonos
            where
             id_usuario = ?
            and
             fecha =?;

            `, [idUsuario, fechasSinDuplicados], (err, abonosCompras) => {
              if (err) {
                reject(err);
                return;
              }
              
             conexion.query(`
             select 
              * 
             from 
              ventas
             where 
              id_usuario = ?
             and 
              fecha = ?
               
             `, [idUsuario, fechasSinDuplicados], (err, ventas) => {
              if (err) {
                reject(err);
                return;
              }
             conexion.query(`
              select 
                efectivoInicial,
                efectivoCierre
              from 
                cajadiaria
              where
                id_usuario = ?
              and 
                fecha = ?;
             `, [idUsuario, fechasSinDuplicados], (err, cajas) => {
              if (err) {
                reject(err);
                return;
              }
              resolve({
                success:true,
                ventas: ventas,
                compras: compras[0],
                gastos:gastos[0], 
                creditosf: creditosf[0], 
                abonosCompras:abonosCompras[0], 
                abonosCredito: abonosCredito[0],
                cajas
              })
             })
             })
            })
          })
        })
      })
    } )
  
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
 *  conexion.query(`
      select 
       *
      from 
       gastos 
      where 
        id_usuario = ? 
       and 
        fecha in(?);
      `, [idUsuario, fechasSinDuplicados], (err, gastos) => {
        if (err) {
          reject(err);
          return;
        }
        
        conexion.query(`
        select
          * 
       from
         compras_fuera_inventario
       where 
        id_usuario = ?
      and
        fecha in(?) 
      and 
        metodo_pago = "pago de contado"
      and 
       procedencia = "caja"     
        `, [idUsuario, fechasSinDuplicados], (err, compras) => {
          if (err) {
            reject(err)
            return;
          }
          conexion.query(`
          select 
           * 
          from 
           creditosf
          where
           id_usuario = ?
          and
           fecha in(?) 
          `, [idUsuario, fechasSinDuplicados], (err, creditosf) => {
            if(err){
              reject(err)
              return;
            }
            conexion.query(`
             select 
              fecha,
              valor
             from 
              abonos_credito
            where
            fecha in(?)
             and 
             id_usuario = ?

            `, [fechasSinDuplicados, idUsuario], (err, abonosCredito) => {
              if (err) {
                reject(err);
                return;
              }
              conexion.query(`
              select
               fecha,
               valor
              from 
               abonos
              where
               id_usuario = ?
              and
               fecha in(?);

              `, [idUsuario, fechasSinDuplicados], (err, abonosCompras) => {
                if (err) {
                  reject(err);
                  return;
                }
                
                resolve({
                  success:true,
                  cajas: cajas.length <= 0 ? [{fecha:""}]:cajas,
                  compras: compras.length <= 0?[{fecha:"",valor:0}]:compras,
                  gastos: gastos.length <= 0? [{fecha:"", valor_gasto:0}]:gastos, 
                  creditosf: creditosf.length <= 0 ? [{fecha:"", valor:0}]: creditosf, 
                  abonosCompras: abonosCompras.length <= 0?[{fecha:"", svalor:0}]:abonosCompras, 
                  abonosCredito: abonosCredito.length <= 0?[{fecha: "", valor:0}]:abonosCredito
                })
              })
            })
            
          })
        })
      } )
 */