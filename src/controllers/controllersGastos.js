const { crearGastosDB, optenerGastosDB, detallesGastosDB, eliminarGastosDB, modificarGastosDB } = require("../services/gastosServices");
const getDate = require("../toolsDev/getDate");
const isNumber = require("../toolsDev/isNumber");
const random = require("../toolsDev/random");

const crearGastos = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const { descripcion, valorGasto, categoria } = req.body;

  // verificacion de datos
  if (!descripcion || !valorGasto || !categoria) {
    res.status(404).json({
      message: "el valor o descripcion son incompletos",
      success: false
    });
    return;
  } else if (!isNumber(valorGasto)) {
    res.status(404).json({
      message: "existe informacion erronea",
      success: false
    });
    return;
  }
  const gasto = {
    idGasto: random(1000, 9000),
    idUsuario,
    descripcion,
    valorGasto,
    categoria,
    fecha: getDate()
  };
  // introduccion de datos
  crearGastosDB(gasto)
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

const modificarGastos = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const data = req.body;

  modificarGastosDB(idUsuario, data)
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

const optenerGastos = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const mes = req.params.mes;
  optenerGastosDB(idUsuario, mes)
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

const eliminarGastos = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const idGasto = req.params.id;
  eliminarGastosDB(idGasto, idUsuario)
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
const detallesGastos = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const { categoria, mes } = req.params;
  detallesGastosDB(categoria, mes, idUsuario)
    .then((result) => {
      if (result.length <= 0) {
        res.status(404).json({
          message: "no existen registros",
          success: false
        });
      } else {
        res.status(200).json({
          message: "exito",
          success: true,
          data: result
        });
      }
    })
    .catch((err) => {
      res.status(505).json({
        message: "error",
        success: false,
        err
      });
    });
};

module.exports = {
  crearGastos,
  modificarGastos,
  optenerGastos,
  eliminarGastos,
  detallesGastos

};
