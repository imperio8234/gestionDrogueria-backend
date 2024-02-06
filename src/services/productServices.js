const conexion = require("../toolsDev/midelware/bd_conection");

const GetAllproductDB = (id, pagina) => {
  const page = (pagina - 1) * 20;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM productos WHERE id_usuario =? LIMIT 20 OFFSET ?", [id, page], (err, result) => {
      if (err) {
        reject(err);
      }
      conexion.query("SELECT CEIL(COUNT(*)/ 20) AS paginas FROM productos where id_usuario=?", [id], (err, pages) => {
        if (err) {
          reject(err);
        } else {
          conexion.query("select distinct distribuidor, laboratorio  from productos where id_usuario = ?", [id], (err, fil) => {
            if (err) {
              reject(err);
            } else {
              conexion.query(`
              select 
                sum((costo * unidades)) valorProductos, 
                sum(((precio * unidades)-(costo * unidades))) ganancias 
              from 
                productos 
              where 
              id_usuario = ?
              `, [id], (err, totalP) => {
                if (err) {
                  reject(err);
                }
                resolve({ success: true, totalP, filtros: fil, data: result, paginas: pages[0] });
              })
            }
          });
        }
      });
    });
  });
};

const DeleteproductDB = (id) => {
  return new Promise((resolve, reject) => {
    conexion.query("DELETE FROM productos WHERE id_producto=?", [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const UpdateproductDB = (updateProduct) => {
  const { ubicacion, nombre, costo, precio, laboratorio, unidades, idProduct, distribuidor, idUsuario, porcentageIva, metodoPago, codeBar } = updateProduct;
  return new Promise((resolve, reject) => {
    conexion.query("UPDATE productos SET nombre =?, unidades =?, precio =?, laboratorio=?, costo=?, metodo_pago =?, distribuidor =?, porcentageIva= ?, codeBar=?, ubicacion=?  WHERE id_producto=? and id_usuario = ?", [nombre, unidades, precio, laboratorio, costo, metodoPago, distribuidor, porcentageIva, codeBar, ubicacion, idProduct, idUsuario], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

const CreateproductDB = (customer) => {
  const { ubicacion, idProduct, idDeuda, nombre, idUsuario, costo, precio, laboratorio, unidades, distribuidor, codeBar, porcentageIva, modalidadPago } = customer;
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM productos WHERE nombre =? and id_usuario = ?", [nombre, idUsuario], (err, resultado) => {
      if (err) {
        reject(err);
      } else {
        if (!resultado.length <= 0) {
          resolve(false);
        } else {
          conexion.query("insert into productos_historial set ? ", [{ codeBar: parseInt(codeBar) ? parseInt(codeBar) : 0, nombre, id_usuario: idUsuario, costo, precio, laboratorio, unidades, fecha: new Date().toLocaleDateString(), distribuidor, porcentageIva, metodo_pago: modalidadPago, id_deuda: idDeuda, id_producto: idProduct, ubicacion }], (err, result) => {
            if (err) {
              reject(err);
            } else {
              conexion.query("INSERT INTO productos SET ?", [{ id_deuda: idDeuda, codeBar: parseInt(codeBar) ? parseInt(codeBar) : 0, nombre, id_usuario: idUsuario, costo, precio, laboratorio, unidades, distribuidor, porcentageIva, metodo_pago: modalidadPago, id_producto: idProduct, ubicacion }], (err, row) => {
                if (err) {
                  reject(err.message);
                } else {
                  resolve(true);
                }
              });
            }
          });
        }
      }
    });
  });
};

const findProductDB = (id, words, idDeuda) => {
  return new Promise((resolve, reject) => {
    if (parseInt(idDeuda) !== 0) {
      conexion.query("select * from productos where nombre like ? and id_usuario = ? and id_deuda = ?", [`%${words}%`, id, idDeuda], (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve({ success: true, data: result });
        }
      });
    } else {
      conexion.query("select * from productos where nombre like ? and id_usuario = ? ", [`%${words}%`, id], (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve({ success: true, data: result });
        }
      });
    }
  });
};

const compraProductosDB = (buyProduct) => {
  const { idDeuda, nombre, costo, precio, laboratorio, unidades, idProduct, distribuidor, idUsuario, porcentageIva, metodoPago } = buyProduct;
  return new Promise((resolve, reject) => {
    conexion.query("insert into productos_historial set ? ", [{ nombre, id_usuario: idUsuario, costo, precio, laboratorio, unidades, fecha: new Date().toLocaleDateString(), distribuidor, porcentageIva, metodo_pago: metodoPago, id_producto: idProduct, id_deuda: idDeuda }], (err, resultado) => {
      if (err) {
        reject(err);
      } else {
        conexion.query("update productos set unidades = unidades + ?, metodo_pago = ? where id_usuario = ? and id_producto = ? ", [unidades, metodoPago, idUsuario, idProduct], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }
    });
  });
};

const filtrarProductoBD = (idUsuario, filtro) => {
  const cantidad = filtro.cantidad;
  const laboratorio = filtro.laboratorio;
  const distribuidor = filtro.distribuidor;

  // CONSULTAS
  let sql = "select * from productos where id_usuario=?";
  if (laboratorio) {
    sql += ` AND laboratorio = '${laboratorio}'`;
  }

  if (cantidad) {
    sql += ` AND unidades <= ${cantidad}`;
  }

  if (distribuidor) {
    // eslint-disable-next-line no-unused-vars
    sql += ` AND distribuidor = '${distribuidor}'`;
  }

  return new Promise((resolve, reject) => {
    conexion.query(sql, [idUsuario], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  GetAllproductDB,
  DeleteproductDB,
  UpdateproductDB,
  CreateproductDB,
  findProductDB,
  compraProductosDB,
  filtrarProductoBD
};
