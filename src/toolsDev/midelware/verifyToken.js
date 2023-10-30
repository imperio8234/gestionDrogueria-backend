const jwt = require("jsonwebtoken");
const verify = (req, res, next) => {
  // const token = req.headers.authorization;
  const token = "Bearer" + " " + req.cookies.aut;
  if (!token) {
    return res.status(401).json({ message: "no hay token" });
  }
  const partes = token.split(" ");

  if (partes.length !== 2 || partes[0] !== "Bearer") {
    return res.status(401).json({ mensaje: "token mal formateado" });
  }
  const tokenjwt = partes[1];
  const clave = "ESTE_ES_UN_SECRETO";

  jwt.verify(tokenjwt, clave, (err, decode) => {
    if (err) {
      return res.status(401).json({ mensaje: "vuelve a iniciar sesion" });
    }
    req.usuario = decode;
    next();
  });
};

module.exports = verify;
