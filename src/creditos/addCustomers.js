const conexion = require("../toolsDev/midelware/bd_conection");

const addCustomers = require("express").Router();

addCustomers.post("/", (req, res) => {
  const { idUsuario, nombre, phoneNumber, date } = req.body;
  // verificacion de cliente registrado
  conexion.query("SELECT * FROM creditos WHERE nombre=?", [nombre], (err, result) => {
    if (err) {
      res.json({
        success: false,
        message: "error al aceder a los datos"

      });
    } else {
      if (!result.length <= 0) {
        res.json({
          success: false,
          message: "el cliente ya esta registrado"
        });
      } else {
        // si el cliente no esta registrado se procede a registrar
        conexion.query("INSERT INTO creditos SET ?", [{ nombre, celular: phoneNumber, id_usuario: idUsuario, fecha: date }], (err, row) => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              message: "error al guardar"
            });
          } else {
            console.log("exito al guardar el clienta");
            res.json({
              success: true,
              message: "exito al guardar",
              data: row
            });
          }
        });
      }
    }
  });
});

module.exports = addCustomers;
