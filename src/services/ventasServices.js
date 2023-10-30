const conexion = require("../toolsDev/midelware/bd_conection");
const crearVentaDB = (venta, productosVendidos) => {
  const { idUsuario, idVenta, valorTotal, fecha, pagaCon, devolucion } = venta;
  return new Promise((resolve, reject) => {
    conexion.query("insert into ventas set id_usuario = ?, id_venta = ?, fecha = ?, total_venta = ?, pago_con =?, devolucion =?", [idUsuario, idVenta, fecha, valorTotal, pagaCon, devolucion], (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        productosVendidos.map(producto => {
          return conexion.query("insert into productos_vendidos set id_producto_vendido=?, id_venta =?, producto =?, cantidad =?, valor =?, laboratorio=?, valor_total=?, id_usuario=?", [producto.id_producto, producto.idVenta, producto.nombre, producto.unidades, producto.precio, producto.laboratorio, producto.valor_total, idUsuario], (err, row) => {
            if (err) {
              reject(err);
            }
            // modificar el inventario
            conexion.query("update productos set unidades = unidades - ? where id_producto =?", [producto.unidades, producto.id_producto], (err, actualizado) => {
              if (err) {
                reject(err);
              } else {
                resolve({ message: "se realizo la venta correctamente", success: true, actualizado });
              }
            });
          });
        });
      }
    });
  });
};

const getVentasDB = (id, pagina, fecha) => {
  const paginas = (pagina - 1) * 50;
  return new Promise((resolve, reject) => {
    conexion.query(`select * from ventas where id_usuario = ? and fecha = "${fecha}" limit 50 offset ?`, [id, paginas], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.length <= 0) {
          resolve({ success: false, message: "no hay registros de ventas" });
        } else {
          // optener el numero de paginas
          conexion.query("SELECT CEIL(COUNT(*)/ 50) AS paginas FROM ventas", (err, page) => {
            if (err) {
              reject(err.message);
            } else {
              resolve({ success: true, venta: result, paginas: page });
            }
          });
        }
      }
    });
  });
};
const getAllVentasDB = (id, pagina) => {
  const paginas = (pagina - 1) * 50;
  return new Promise((resolve, reject) => {
    conexion.query("select fecha from ventas where id_usuario = ? limit 50 offset ?", [id, paginas], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.length <= 0) {
          resolve({ success: false, message: "no hay registros de ventas" });
        } else {
          // optener el numero de paginas
          conexion.query("SELECT CEIL(COUNT(*)/ 50) AS paginas FROM ventas", (err, page) => {
            if (err) {
              reject(err.message);
            } else {
              resolve({ success: true, ventas: result, paginas: page });
            }
          });
        }
      }
    });
  });
};

const getProductosDB = (idVenta) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from productos_vendidos where id_venta = ?", [idVenta], (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        resolve({ success: true, result });
      }
    });
  });
};
const getGraficosDB = (idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from ventas where id_usuario = ?", [idUsuario], (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        resolve({ success: true, ventas: result });
      }
    });
  });
};

const eliminarVentas = (idventa) => {
  return new Promise((resolve, reject) => {
    conexion.query("delete from ventas where id_venta = ?", [idventa], (err, row) => {
      if (err) {
        reject(err.message);
      } else {
        resolve({ message: "se elimino correctamente", affect: row.affectedRows });
      }
    });
  });
};
const buscarProductoDB = (producto, idUsuario) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from productos where nombre  like ? or codeBar = ? and id_usuario =?  ", [`%${producto}%`, producto, idUsuario], (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(result);
      }
    });
  });
};
module.exports = {
  crearVentaDB,
  getVentasDB,
  getProductosDB,
  eliminarVentas,
  buscarProductoDB,
  getAllVentasDB,
  getGraficosDB
};
