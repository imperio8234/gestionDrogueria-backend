const conexion = require("../toolsDev/midelware/bd_conection");

const getCreditsRegistered = require("express").Router();
getCreditsRegistered.get("/:idcredit", (req, res) => {
  const idCredito = req.params.idcredit;

  conexion.query("SELECT * FROM suma_credito WHERE id_credito=?", [idCredito], (err, result) => {
    if (err) {
      res.status(500).json({
        message: "no se pudo acceder a la informacion",
        success: false
      });
    } else {
      if (result.length <= 0) {
        res.json({
          message: "cliente sin registro",
          success: false,
          status: 404
        });
      } else {
        res.json({
          message: "se encontraron registros",
          success: true,
          data: result,
          status: 200
        });
      }
    }
  });
});
module.exports = getCreditsRegistered;
