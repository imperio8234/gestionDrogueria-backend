const { crearComprafDB, modificarComprafDB, optenerComprafDB, eliminarComprafDB } = require("../services/servicesCompraFueraInventario");
const getDate = require("../toolsDev/getDate");
const isNumber = require("../toolsDev/isNumber");
const random = require("../toolsDev/random");

const crearCompraf = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const { descripcion, valorCompraf, idDeuda, metodoPago, procedencia, fecha } = req.body;

  // verificacion de datos
  if (!descripcion || !valorCompraf) {
    res.status(404).json({
      message: "el valor o descripcion son incompletos",
      success: false
    });
    return;
  } else if (!isNumber(valorCompraf)) {
    res.status(404).json({
      message: "existe informacion erronea",
      success: false
    });
    return;
  }
  const compraf = {
    idCompraf: random(1000, 9000),
    idDeuda,
    idUsuario,
    descripcion,
    valorCompraf,
    metodoPago, 
    procedencia,
    fecha
  };
    // introduccion de datos
  crearComprafDB(compraf)
    .then((result) => {
      res.status(200).json({
        message: "exito",
        success: true
      });
    })
    .catch((err) => {
      if (err) {
        res.status(505).json({
          success: false,
          message: "error",
          err
        });
      }
    });
};

const modificarCompraf = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const data = req.body;

  modificarComprafDB(idUsuario, data)
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "se actualizo exitosamente",
          success: true
        });
      }
    })
    .catch((err) => {
      if (err) {
        res.status(505).json({
          message: "error",
          err,
          success: false
        });
      }
    });
};

const optenerCompraf = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const fecha = req.params.fecha;
  const idDeuda = req.params.id;
  const pagina = req.params.pagina;

  optenerComprafDB(idUsuario, fecha, idDeuda, pagina)
    .then((result) => {
      if (result) {
        res.status(200).json({
          data: result,
          success: true
        });
      }
    })
    .catch((err) => {
      if (err) {
        res.status(505).json({
          message: err,
          success: false
        });
      }
    });
};

const eliminarCompraf = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const idCompraf = req.params.id;
  eliminarComprafDB(idCompraf, idUsuario)
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "se elimino exitosamente",
          success: true
        });
      }
    })
    .catch((err) => {
      if (err) {
        res.status(505).json({
          message: "error",
          err,
          success: false
        });
      }
    });
};

module.exports = {
  crearCompraf,
  modificarCompraf,
  optenerCompraf,
  eliminarCompraf
};
