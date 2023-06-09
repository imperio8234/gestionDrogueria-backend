const conexion = require("../toolsDev/midelware/bd_conection");

const deletedCustomer = require("express").Router();

deletedCustomer.delete("/:customer", (req, res) => {
  const nombre = req.params.customer;

  conexion.query("DELETE FROM creditos WHERE nombre =?", [nombre], (err, row) => {
    if (err) {
      res.json({
        message: "el cliente aun tiene registros",
        success: false
      });
    } else {
      res.json({
        message: `se elimino correctamente a ${nombre}`,
        success: true,
        row: row.affectedRows
      });
    }
  });
});

module.exports = deletedCustomer;
