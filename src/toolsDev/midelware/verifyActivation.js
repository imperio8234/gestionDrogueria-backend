const verifyDate = require("../useVerIfyDate");
const Activation = (req, res, next) => {
  const { activo, fecha, inicio } = req.usuario;
  const periodoExpirado = verifyDate(fecha, inicio);

  if (periodoExpirado <= 0 && activo === 1) {
    next();
  } else if (!periodoExpirado <= 0) {
    req.prueba = "sigues en periodo de prueba te faltan" + " " + periodoExpirado;
    next();
  } else {
    return res.status(500).json({ message: "tu periodo de prueba ya ha terminado" });
  }
};

module.exports = Activation;
