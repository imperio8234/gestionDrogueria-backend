const conexion = require("../toolsDev/midelware/bd_conection");
const getProductosMetricaDB = (idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from productos where costo - precio = 0 and id_usuario =?", [idUsuario], (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        conexion.query("select * from productos where unidades <= 2 and id_usuario =?", [idUsuario], (err, low) => {
          if (err) {
            reject(err.message);
          } else {
            resolve({ success: true, data: { estockBajo: low, gananciasCero: result } });
          }
        });
      }
    });
  });
};
const getcreditosMetricaDB = (idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("select id_credito from creditos where id_usuario =?", [idUsuario],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          // console.log("este es el conjunto entrante", result)
          const conjunto = [];
          for (const i in result) {
            conjunto.push(result[i].id_credito);
          }
          // unificar los datos con los valores de cada credito registrado
          conexion.query(`select id_credito, sum(valor) as total 
          from(
            select id_credito, valor from suma_credito 
            union all 
            select id_credito, valor from abonos_credito
            ) as id_credito 
            where id_credito in (${conjunto}) 
            group by id_credito 
            ORDER BY total desc 
            limit 7`, (err, obj) => {
            if (err) {
              reject(err);
            } else {
              const resultado = obj.map(obj1 => {
                const obj2 = result.find(obj2 => obj2.id_credito === obj1.id_credito);
                return { ...obj1, ...obj2 };
              });

              //  pedir los datos de cada credito y sumarlo en un total
              conexion.query(`select id_credito, sum(valor) as total 
              from(
                select id_credito, valor from suma_credito 
                union all 
                select id_credito, valor from abonos_credito
                ) as id_credito 
                where id_credito in (${conjunto}) 
                group by id_credito  
                `, (err, sum) => {
                if (err) {
                  reject(err);
                } else {
                  //  recorrer el resultado de la peticcion
                  const total = [];
                  for (const i in sum) {
                    total.push(sum[i].total);
                  }
                  //  sumar todos los resultados
                  const totalSuma = total.reduce((a, b) => {
                    return a + b;
                  });

                  //  enviar todos los resultados
                  resolve({ success: true, creditos: resultado, total: totalSuma });
                }
              });
            }
          });
        }
      });
  });
};
const getdeudasMetricaDB = (idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("select id_deuda from deudas where id_usuario =?", [idUsuario],
      (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          const conjunto = [];
          for (const i in result) {
            conjunto.push(result[i].id_deuda);
          };

          // se confirma si existen datos
          if (conjunto.length <= 0) {
            resolve({ success: false, message: "no existen datos que mostrar" });
          } else {
            // unificar los datos con los valores de cada credito registrado
            conexion.query(`select id_deuda, sum(valor) as total 
              from(
                select id_deuda, valor from suma_deuda 
                union all 
                select id_deuda, valor from abonos
                ) as id_deuda 
                where id_deuda in (${conjunto}) 
                group by id_deuda 
                ORDER BY total desc 
                limit 7`, (err, obj) => {
              if (err) {
                reject(err.message);
              } else {
                const resultado = obj.map(obj1 => {
                  const obj2 = result.find(obj2 => obj2.id_deuda === obj1.id_deuda);
                  return { ...obj1, ...obj2 };
                });

                //  pedir los datos de cada credito y sumarlo en un total
                conexion.query(`select id_deuda, sum(valor) as total 
                  from(
                    select id_deuda, valor from suma_deuda 
                    union all 
                    select id_deuda, valor from abonos
                    ) as id_deuda 
                    where id_deuda in (${conjunto}) 
                    group by id_deuda  
                    `, (err, sum) => {
                  if (err) {
                    reject(err.message);
                  } else {
                  //  recorrer el resultado de la peticcion
                    const total = [];
                    for (const i in sum) {
                      total.push(sum[i].total);
                    }
                    //  sumar todos los resultados
                    const totalSuma = total.reduce((a, b) => {
                      return a + b;
                    });

                    //  enviar todos los resultados
                    resolve({ success: true, deudas: resultado, total: totalSuma });
                  }
                });
              }
            });
          }
        }
      });
  });
};

module.exports = {
  getProductosMetricaDB,
  getcreditosMetricaDB,
  getdeudasMetricaDB
};
