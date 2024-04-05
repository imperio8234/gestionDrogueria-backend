const conexion = require("../toolsDev/midelware/bd_conection");
const crearcreditofDB = (credito) => {
  const { idCreditof, idUsuario, descripcion, valorCreditof, fecha, idCredito } = credito;
  return new Promise((resolve, reject) => {
    conexion.query("insert into creditosf (id_creditof, id_usuario, descripcion, valor, fecha, id_credito) VALUES (?,?,?,?,?,?)",
      [idCreditof, idUsuario, descripcion, valorCreditof, fecha, idCredito], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const modificarcreditofDB = (idUsuario, data) => {
  const query = `
  update creditosf 
  set descripcion = CASE 
              WHEN ? <> '' THEN ?
              ELSE descripcion
                    END,
      valor = CASE
                        WHEN ? <> '' THEN ?
                        ELSE valor
                    END
    where id_usuario =? and id_creditof = ?;

  `;
  const { descripcion, valorCreditof, id } = data;
  return new Promise((resolve, reject) => {
    conexion.query(query,
      [descripcion, descripcion, valorCreditof, valorCreditof, idUsuario, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const optenercreditofDB = (idUsuario, idCredito, pagina) => {
 
  return new Promise((resolve, reject) => {
    conexion.query( `
    select 
     * 
    from 
     creditosf 
    where 
     id_usuario = ? 
    and 
     id_credito = ?
     limit 30
     offset ?
    `, [parseInt(idUsuario), parseInt(idCredito), parseInt(pagina)], (err, result) => {
      if (err) {
        reject(err);
      } else {
        conexion.query(`
        select 
         sum(valor) valor
        from 
         creditosf
        where 
         id_usuario = ?
        `, [idUsuario], (err, vCreditosf) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({result, vCreditosf});
        })
        
      }
    });
  });
};

const eliminarcreditofDB = (idcreditof, idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("delete from creditosf where id_creditof =? and id_usuario =?", [idcreditof, idUsuario], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
module.exports = {
  crearcreditofDB,
  modificarcreditofDB,
  optenercreditofDB,
  eliminarcreditofDB

};
