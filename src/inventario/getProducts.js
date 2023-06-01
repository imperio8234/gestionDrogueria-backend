const conexion = require("../toolsDev/midelware/bd_conection");

const getProducts = require("express").Router();

getProducts.get("/", (req, res) => {
  conexion.query("SELECT * FROM productos", async (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length <= 0) {
        res.json({
          success: false,
          data: result
        });
      } else {
        res.json({
          success: true,
          data: result
        });
      };
    };
  });
});

// buscar producto

getProducts.get("/buscar/:product", (req, res) => {
  const product = req.params.product;

  conexion.query(`SELECT * FROM productos WHERE nombre LIKE '%${product}%'`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length <= 0) {
        res.json({
          success: false,
          data: "no se encontro"
        });
      } else {
        res.json({
          success: true,
          data: result
        });
      };
    };
  });
});

// filtrado de productos

getProducts.get("/filtro/:filtrar", (req, res) => {
  const filtrar = JSON.parse(req.params.filtrar);
  // se especifica que peticion a la base de datos se piensa hacer
  if (filtrar.modo === "valor") {
    // filtrar por valor

    conexion.query(`SELECT * FROM productos WHERE precio <= ${filtrar.precio}`, (err, result) => {
      if (err) {
        res.json({
          message: "error al acceder"
        });
      } else {
        // se comprueba si existen productos
        if (result.length <= 0) {
          res.json({
            success: false,
            data: "no se encontro ningun producto"
          });
        } else {
          res.json({
            success: true,
            message: "productos encontrados",
            data: result
          });
        };
      };
    });
  } else if (filtrar.modo === "cantidad") {
    // filtrar por cantidad
    conexion.query(`SELECT * FROM productos WHERE unidades <= ${filtrar.cantidad}`, (err, result) => {
      if (err) {
        res.json({
          message: "error al acceder"
        });
      } else {
        // se comprueba si existen productos
        if (result.length <= 0) {
          res.json({
            success: false,
            data: "no se encontro ningun producto"
          });
        } else {
          res.json({
            success: true,
            message: "productos encontrados",
            data: result
          });
        };
      };
    });
  };
});

module.exports = getProducts;
