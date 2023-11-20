const verifyDate = require("../useVerIfyDate");
const Activation = (req, res, next) => {
  const { fecha } = req.usuario;
  const date = fecha.split("/");
  const newDate = [date[2], date[1], date[0]].join("-");
  const periodoExpirado = verifyDate(newDate);

  if (periodoExpirado < 0) {
    return res.status(500).json({ message: "tu mensualidad termino", status: 500 });
  } else {
    req.prueba = periodoExpirado;
    next();
  }
};

module.exports = Activation;
