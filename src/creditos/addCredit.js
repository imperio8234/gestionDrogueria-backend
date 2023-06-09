const conexion = require("../toolsDev/midelware/bd_conection");

const addCredit = require("express").Router();

addCredit.post("/", (req, res) => {
  const { idCredito, product, date, value } = req.body;

  conexion.query("INSERT INTO suma_credito SET ?", [{ id_credito: idCredito, fecha: date, producto: product, valor: value }], (err, result) => {
    if (err) {
      res.status(500).json({
        message: "error en el proceso",
        success: true
      });
    } else {
      res.status(200).json({
        message: "se guardo el registro exitosamente",
        success: true
      });
    }
  });
});

module.exports = addCredit;
