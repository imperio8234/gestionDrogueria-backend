const conexion = require("../toolsDev/midelware/bd_conection");

const addSubtractRecord = require("express").Router();

addSubtractRecord.post("/", (req, res) => {
  const { idCredito, date, value } = req.body;

  conexion.query("INSERT INTO abonos_credito SET ?", [{ id_credito: idCredito, fecha: date, valor: value }], (err, row) => {
    if (err) {
      res.json({
        message: "no se guardo el registro",
        success: false,
        status: 500
      });
    } else {
      res.json({
        message: "se guardo exitosaente el registro",
        success: true,
        status: 200
      });
    }
  });
});
module.exports = addSubtractRecord;
