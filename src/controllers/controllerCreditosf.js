const { modificarcreditofDB, crearcreditofDB, eliminarcreditofDB, optenercreditofDB } = require("../services/creditosfServices");
const getDate = require("../toolsDev/getDate");
const isNumber = require("../toolsDev/isNumber");
const random = require("../toolsDev/random");

const crearCreditof = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const { descripcion, valorCreditof, idCredito, fecha } = req.body;

  // verificacion de datos
  if (!descripcion || !valorCreditof) {
    res.status(404).json({
      message: "el valor o descripcion son incompletos",
      success: false
    });
    return;
  } else if (!isNumber(valorCreditof)) {
    res.status(404).json({
      message: "existe informacion erronea",
      success: false
    });
    return;
  }
  const Creditof = {
    idCreditof: random(1000, 9000),
    idCredito,
    idUsuario,
    descripcion,
    valorCreditof,
    fecha
  };
    // introduccion de datos
  crearcreditofDB(Creditof)
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

const modificarCreditof = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const data = req.body;
  modificarcreditofDB(idUsuario, data)
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

const optenerCreditof = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const idCredito = req.params.id;
  const pagina = req.params.pagina;

  optenercreditofDB(idUsuario, idCredito, pagina)
    .then((result) => {
      if (result) {
        res.status(200).json({
          data: result,
          valorTotal: result.vCreditosf[0].valor,
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

const eliminarCreditof = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const idCreditof = req.params.id;
  eliminarcreditofDB(idCreditof, idUsuario)
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
  crearCreditof,
  modificarCreditof,
  optenerCreditof,
  eliminarCreditof
};
