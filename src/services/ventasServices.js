const conexion = require("../toolsDev/midelware/bd_conection");
const crearVentaDB = (venta, productosVendidos) => {
  const { idUsuario, idVenta, valorTotal, fecha } = venta;
  return new Promise((resolve, reject) => {
    conexion.query("insert into ventas set id_usuario = ?, id_venta = ?, fecha = ?, total_venta = ?", [idUsuario, idVenta, fecha, valorTotal], (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        productosVendidos.map(producto => {
          return conexion.query("insert into productos_vendidos set id_producto_vendido=?, id_venta =?, producto =?, cantidad =?, valor =?, laboratorio=?, valor_total=?", [producto.id_producto, producto.idVenta, producto.producto, producto.cantidad, producto.valor, producto.laboratorio, producto.valor_total], (err, row) => {
            if (err) {
              reject(err);
            }
            // modificar el inventario
            conexion.query("update productos set unidades = unidades - ? where id_producto =?", [producto.cantidad, producto.idProducto], (err, actualizado) => {
              if (err) {
                console.log(err);
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

const getVentasDB = (id, pagina, fecha1) => {
  const paginas = (pagina - 1) * 50;
  const { dia, mes, año } = fecha1;
  const fecha = `${dia}/${mes}/${año}`;

  return new Promise((resolve, reject) => {
    conexion.query("select * from ventas where id_usuario = ? and fecha =? limit 50 offset ?", [id, fecha, paginas], (err, result) => {
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

const getProductosDB = (idVenta) => {
  return new Promise((resolve, reject) => {
    conexion.query("select * from productos_vendidos where id_venta = ?", [idVenta], (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(result);
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
    conexion.query("select * from productos where nombre  like ? and id_usuario =?", [`%${producto}%`, idUsuario], (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        console.log(result)
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
  buscarProductoDB
};
