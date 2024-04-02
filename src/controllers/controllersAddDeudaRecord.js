const { GetAllDeudaDB, CreateDeudaDB, UdateDeudaDB, DeleteDeudaDB } = require("../services/servicesAddDeudaRecord");
const getDate = require("../toolsDev/getDate");

const CreateDeuda = (req, res) => {
  const { idDeuda, fecha, producto, valor } = req.body;
  const Deuda = {
    idDeuda,
    fecha: getDate(),
    producto,
    valor
  };

  CreateDeudaDB(Deuda)
    .then(result => {
      if (result) {
        res.json({
          message: "se guardo exitosamente",
          success: true
        });
      } else {
        res.json({
          message: "error al guardar",
          success: false
        });
      }
    })
    .catch(err => {
      if (err) {
        res.json({
          message: err,
          success: false
        });
      }
    });
};
const GetDeuda = (req, res) => {
  const idDeuda = req.params.id;
  const pages = req.params.page;
  const idUsuario = req.usuario.id_usuario;
  GetAllDeudaDB(idDeuda, idUsuario, pages)
    .then(result => {
      if (!result.data.length <= 0) {
        res.json({
          success: true,
          data: result
        });
      } else {
        res.json({
          message: "no hay registros",
          success: false
        });
      }
    })
    .catch(err => {
      if (err) {
        res.json({
          success: false,
          message: "error al obener los datos"
        });
      }
    });
};

const DeletDeuda = (req, res) => {
  const idDeuda = req.params.id;
  DeleteDeudaDB(idDeuda).then(e => {
    if (e) {
      res.json({
        success: true,
        message: "se elimino correctamente"
      });
    }
  }).catch(err => {
    if (err) {
      res.json({
        success: false,
        message: "error al eliminar",
        error: err
      });
    }
  });
};

const UpdateDeuda = (req, res) => {
  const { fecha, idDeuda, producto, valor } = req.body;

  const updateDeuda = {
    fecha : getDate(),
    idDeuda,
    producto,
    valor
  };
  UdateDeudaDB(updateDeuda)
    .then(result => {
      if (result) {
        res.json({
          message: "se actualizo  correctamente",
          success: true
        });
      }
    })
    .catch(err => {
      res.json({
        message: "error al actualizar",
        data: err,
        success: false
      });
    });
};

module.exports = {

  GetDeuda,
  DeletDeuda,
  UpdateDeuda,
  CreateDeuda

};
