const { crearGastosDB } = require("../services/gastosServices");
const isNumber = require("../toolsDev/isNumber");

const crearGastos = (req, res) => {
  // const idUsuario = req.usuario.id_usuario;
  const { idGasto, idUsuario, descripcion, valorGasto, fecha } = req.body;

  // verificacion de datos
  if (!descripcion || !valorGasto) {
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

  // introduccion de datos
  crearGastosDB(idGasto, idUsuario, descripcion, valorGasto, fecha)
    .then((result) => {
      console.log(result);
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

const modificarGastos = () => {

};

const optenerGastos = () => {

};

const eliminarGastos = () => {

};

module.exports = {
  crearGastos,
  modificarGastos,
  optenerGastos,
  eliminarGastos

};
