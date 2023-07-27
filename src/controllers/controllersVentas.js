const { crearVentaDB, getVentasDB, getProductosDB, buscarProductoDB } = require("../services/ventasServices");

const crearVenta = (req, res) => {
  const { idUsuario, idVenta, valorTotal, productosVendidos } = req.body;
  const venta = {
    idUsuario,
    idVenta,
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
  const id = req.params.id;
  const pagina = req.params.page;
  const fecha = {
    dia: 23,
    mes: 6,
    año: 2023
  };
  getVentasDB(id, pagina, fecha)
    .then(result => {
      if (result.success) {
        res.json({
          data: result,
          success: true
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
      console.log(result);
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
  const idUsuario = req.params.idusuario;
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
const eliminarVenta = () => {

};
module.exports = {
  crearVenta,
  getVentas,
  getProductosVentas,
  buscarProducto
};
