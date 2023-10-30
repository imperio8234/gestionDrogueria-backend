const verifyDate = require("../useVerIfyDate");
const Activation = (req, res, next) => {
  const { activo, fecha } = req.usuario;
  const date = fecha.split("/");
  const newDate = [date[2], date[1], date[0]].join("-");
  const periodoExpirado = verifyDate(newDate);
  if (!periodoExpirado <= 0 && activo === 1) {
    req.prueba = periodoExpirado;
    next();
  } else if (!periodoExpirado <= 0) {
    req.prueba = "sigues en periodo de prueba te faltan" + " " + periodoExpirado;
    next();
  } else {
    console.log("ya has termnado")
    return res.status(500).json({ message: "tu periodo de prueba ya ha terminado", status: 500 });
  }
};

module.exports = Activation;
