const conexion = require("../toolsDev/midelware/bd_conection");

const deleteProducto = require("express").Router();

deleteProducto.delete("/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  conexion.query("DELETE FROM productos WHERE nombre =?", [nombre], async (err, row) => {
    if (err) {
      res.json({
        success: false,
        message: "no se pudo eliminar"
      });
    } else {
      res.json({
        success: true,
        result: row.affectedRows,
        message: "se elimino corretamente"
      });
    };
  });
});

module.exports = deleteProducto;
