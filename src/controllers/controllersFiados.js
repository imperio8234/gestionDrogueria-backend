const { eliminarFiadoDB, optenerFiadoDB, modificarFiadoDB, crearFiadoDB } = require("../services/servicesFiado");
const getDate = require("../toolsDev/getDate");
const isNumber = require("../toolsDev/isNumber");
const random = require("../toolsDev/random");

const crearFiado = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const { descripcion, valorFiado, idCredito } = req.body;

  // verificacion de datos
  if (!descripcion || !valorFiado) {
    res.status(404).json({
      message: "el valor o descripcion son incompletos",
      success: false
    });
    return;
  } else if (!isNumber(valorFiado)) {
    res.status(404).json({
      message: "existe informacion erronea",
      success: false
    });
    return;
  }
  const fiado = {
    idFiado: random(1000, 9000),
    idCredito,
    idUsuario,
    descripcion,
    valorFiado,
    fecha: getDate()
  };
    // introduccion de datos
  crearFiadoDB(fiado)
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

const modificarFiado = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const data = req.body;

  modificarFiadoDB(idUsuario, data)
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

const optenerFiado = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const fecha = req.params.fecha;
  const idCredito = req.params.id;
  optenerFiadoDB(idUsuario, idCredito, fecha)
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

const eliminarFiado = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const idGasto = req.params.id;
  eliminarFiadoDB(idGasto, idUsuario)
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
  crearFiado,
  modificarFiado,
  eliminarFiado,
  optenerFiado
};
