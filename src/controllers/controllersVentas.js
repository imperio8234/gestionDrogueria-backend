const { crearVentaDB, getVentasDB, getProductosDB, buscarProductoDB, getAllVentasDB, getGraficosDB } = require("../services/ventasServices");

const crearVenta = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const { idVenta, valorTotal, productosVendidos, pagaCon, devolucion } = req.body;

  const venta = {
    idUsuario,
    idVenta,
    pagaCon,
    devolucion,
    valorTotal,
    fecha: new Date().toLocaleDateString()
  };
  crearVentaDB(venta, productosVendidos)
    .then(result => {
      if (result.success) {
        res.json({
          message: "venta exitosa",
          success: true
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
        success: false
      });
    });
};

const getVentas = (req, res) => {
  const id = req.usuario.id_usuario;
  const pagina = req.params.page;
  const fecha = req.params.fecha.split(",");
  const sinCero = parseInt(fecha[1], 10).toString();
  fecha.splice(1, 0, sinCero);
  const nuevo = [...fecha];
  nuevo.splice(2, 1);
  getVentasDB(id, pagina, nuevo.join("/"))
    .then(result => {
      if (result.success) {
        const total = [].concat(...result.venta.map(valor => valor.total_venta));
        const ventas = total.reduce((a, b) => a + b, 0);
        res.json({
          data: result.venta,
          valorVentas: ventas,
          success: true,
          page: result.paginas
        });
      } else {
        res.json({
          message: "sin registros",
          success: false
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        err,
        success: false
      });
    });
};
const getAllVentas = (req, res) => {
  const id = parseInt(req.usuario.id_usuario);
  const pagina = req.params.page;

  getAllVentasDB(id, pagina)
    .then(result => {
      if (result.success) {
        const fechas = [].concat(...result.ventas.map(fecha => fecha.fecha));
        const fechas2 = [...new Set(fechas)];

        res.json({
          data: fechas2,
          success: true,
          page: result.paginas
        });
      } else {
        res.json({
          message: "sin registros",
          success: false
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        err,
        success: false
      });
    });
};

const getProductosVentas = (req, res) => {
  const idVenta = req.params.idventa;
  getProductosDB(idVenta)
    .then(result => {
      res.json({
        success: true,
        data: result.result
      });
    })
    .catch(err => {
      res.status(500).json({
        err,
        success: false
      });
    });
};
const getGraficosVentas = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  getGraficosDB(idUsuario)
    .then(result => {
      // optenemos las fechas solas
      const ventas = result.ventas.map(venta => venta.fecha);
      // eliminamos las fechas repetidas
      const reduce = [...new Set(ventas)];
      // reducimos solo al mes y año quitamos los dias
      const mesAño = reduce.map(fecha => fecha.split("/").splice(1, 2).join("/"));

      // eliminamos los años y meces repetidos
      const mesAñoReduce = [...new Set(mesAño)].sort((a, b) => parseInt(a.split("/")[0]) - parseInt(b.split("/")[0]));
      // meses
      const nombresDeMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];

      // agrupar los valores con las fechas reducidas

      const totales = reduce.map(fecha => {
        const find = result.ventas.filter(item => item.fecha === fecha);
        const totalVenta = find.map(item => item.total_venta);
        const totalVentas = totalVenta.reduce((a, b) => a + b, 0);

        return {
          fecha,
          valores: totalVentas
        };
      });

      // agrupamos el mes y año con sus respectivos dias y valores del dia transcurrido
      const resultado = mesAñoReduce.map(item => {
        const find = totales.filter(item2 => item2.fecha.split("/").splice(1, 2).join("/") === item);
        // quitamos años y meses dejamos dias
        const fechaValor = find.map(fV => {
          return {
            dia: fV.fecha.split("/")[0],
            valor: fV.valores
          };
        });

        return {
          mes: nombresDeMeses[parseInt(item.split("/").splice(0, 1)[0]) - 1],
          dias: fechaValor.sort((a, b) => parseInt(a.dia) - parseInt(b.dia))
        };
      });
      res.json({
        success: true,
        data: resultado
      });
    })
    .catch(err => {
      res.status(500).json({
        err,
        success: false
      });
    });
};
const buscarProducto = (req, res) => {
  const nombreProducto = req.params.nombreproducto;
  const idUsuario = req.usuario.id_usuario;
  buscarProductoDB(nombreProducto, idUsuario)
    .then(result => {
      if (!result.length <= 0) {
        res.json({
          data: result,
          success: true
        });
      } else {
        res.json({
          message: "no se encontro el producto",
          success: false
        });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).json({
          message: "error",
          success: false,
          err
        });
      }
    });
};
// const eliminarVenta = () => {
//
// };
module.exports = {
  crearVenta,
  getVentas,
  getProductosVentas,
  buscarProducto,
  getAllVentas,
  getGraficosVentas
};
