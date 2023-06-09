const conexion = require("../toolsDev/midelware/bd_conection");

const getCustomers = require("express").Router();

getCustomers.get("/", (req, res) => {
  conexion.query("SELECT * FROM creditos", (err, result) => {
    if (err) {
      res.json({
        success: false,
        message: "error al conectar"
      });
    } else {
      if (result.length <= 0) {
        res.status(404).json({
          success: false,
          message: "no hay clentes registrados"
        });
      } else {
        res.status(200).json({
          success: true,
          data: result
        });
      }
    }
  });
});

module.exports = getCustomers;
