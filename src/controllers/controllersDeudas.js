const { CreatedeudaDB, GetAlldeudaDB, DeletedeudaDB, UpdatedeudaDB, findDeudaDB } = require("../services/deudasServices");

const CreateDeudas = (req, res) => {
  const { idUsuario, nombre, celular, date } = req.body;
  const customer = {
    idUsuario,
    nombre,
    celular,
    date
  };

  CreatedeudaDB(customer)
    .then(result => {
      if (result) {
        res.json({
          message: "se guardo exitosamente",
          success: true
        });
      } else {
        res.json({
          message: "la deuda ya esta registrada",
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
const GetDeudas = (req, res) => {
  const id = req.params.id;
  const page = req.params.page;
  GetAlldeudaDB(id, page)
    .then(result => {
      if (!result.data.data.length <= 0) {
        res.json({
          data: result.data,
          paginas: result.paginas,
          success: true
        });
      } else {
        res.json({
          success: false,
          message: "no hay registros"
        });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).json({
          message: err,
          success: false
        });
      }
    });
};

const DeletDeudas = (req, res) => {
  const idCustomer = req.params.idcustomer;
  DeletedeudaDB(idCustomer).then(e => {
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
        message: " hay registros debes eliminarlos para continuar"
      });
    }
  });
};

const UpdateDeudas = (req, res) => {
  const { nombre, idCredito, fecha, celular } = req.body;

  const updateCustomer = {
    nombre,
    idCredito,
    fecha,
    celular
  };
  UpdatedeudaDB(updateCustomer)
    .then(result => {
      if (result) {
        res.json({
          message: "se alcualizo correctamente",
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

const findDeudas = (req, res) => {
  const id = req.params.id;
  const words = req.params.words;

  findDeudaDB(id, words)
    .then(result => {
      if (result.success) {
        res.json({
          success: result.success,
          data: result.result
        });
      } else {
        res.json({
          message: result.message,
          success: result.success
        });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).json({
          message: "error ",
          err
        });
      }
    });
};
module.exports = {

  GetDeudas,
  DeletDeudas,
  UpdateDeudas,
  CreateDeudas,
  findDeudas

};
