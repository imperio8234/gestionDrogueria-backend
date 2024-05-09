const conexion = require("../toolsDev/midelware/bd_conection");
const crearcajaDiariaDB = (caja) => {
  const { idCajaDiaria, idUsuario, efectivoInicial, fecha, } = caja;
  const fechaFormat = fecha.split("-").reverse().join("/");
  return new Promise((resolve, reject) => {
    conexion.query(`
    select 
     * 
    from 
    cajaDiaria
     where
      id_usuario = ?
    and 
     fecha = ?
    

    `, [idUsuario, fechaFormat], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
     if (result.length >= 1) {
       resolve({success:false})
     } else {
      conexion.query("insert into cajaDiaria (id_caja, id_usuario, efectivoInicial, fecha) VALUES (?,?,?,?)",
      [idCajaDiaria, idUsuario, efectivoInicial, fechaFormat], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
     }
    })
  });
};

const modificarcajaDiariaDB = (idUsuario, data) => {
  const query = `
  update cajaDiaria set efectivoInicial = CASE
    WHEN ? <> '' THEN ?
     ELSE efectivoInicial
       END,
     efectivoCierre = 
       CASE 
        WHEN ? <> '' THEN ?
         ELSE 
         efectivoCierre
        END
    where id_caja = ? AND id_usuario =?;
  `;
  const { efectivoInicial, efectivoCierre, id } = data;
  return new Promise((resolve, reject) => {
    conexion.query(query,
      [efectivoInicial, efectivoInicial, efectivoCierre, efectivoCierre, id, idUsuario], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const optenercajaDiariaDB = (idUsuario, fecha, pagina) => {
  const año = fecha.split("y")[1];
  const mes = fecha.split("y")[0];
  const page = (pagina - 1) * 30;
  const consultarCaja = `
  SELECT 
  *
  FROM cajaDiaria
  WHERE 
  id_usuario = ?
  AND MONTH(STR_TO_DATE(fecha, '%d/%m/%Y'))  in(?)
  AND STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN ? and ?
  LIMIT 30
  OFFSET ?;`;

const values = [idUsuario, mes ,`${año}-01-01`, `${año}-12-31`, parseInt(page)];

  return new Promise((resolve, reject) => {
    conexion.query(consultarCaja, values, (err, cajas) => {
      if (err) {
        reject(err)
        return;
      }

      // fechas para consultas 
      const fechas = [].concat(...cajas.map(caja => caja.fecha));
      const fechasSinDuplicados = [...new Set(fechas)];
    
      if (fechasSinDuplicados.length <= 0) {
        resolve({message: "no existen registros", success: false})
        return;
      }
      conexion.query(`
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
    })
  });
};

const eliminarcajaDiariaDB = (idcajaDiaria, idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("delete from cajaDiaria where id_caja =? and id_usuario =?", [idcajaDiaria, idUsuario], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
module.exports = {
  crearcajaDiariaDB,
  modificarcajaDiariaDB,
  optenercajaDiariaDB,
  eliminarcajaDiariaDB

};
