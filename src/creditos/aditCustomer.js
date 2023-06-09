const conexion = require("../toolsDev/midelware/bd_conection");

const editCustomer = require("express").Router();

editCustomer.put("/", (req, res) => {
  const { nombre, idCredito, fecha, celular } = req.body;

  conexion.query("UPDATE creditos SET nombre =?, celular=?, fecha=? WHERE id_credito =?", [nombre, celular, fecha, idCredito], (err, row) => {
    if (err) {
      res.json({
        message: "error al actualizar",
        data: err,
        success: false
      })
    } else {
      res.json({
        message: "se alcualizo correctamente",
        success: true
      });
    }
  });
});

module.exports = editCustomer;
