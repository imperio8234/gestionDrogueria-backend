const { GetAllRecordDB, CreateRecordDB, UdateRecordDB, DeleteRecordDB } = require("../services/addCreditsRecordServices");
const isNumber = require("../toolsDev/isNumber.js");
const { is } = require("../toolsDev/isNumber.js");
const CreateRecord = (req, res) => {
  const { idCredito, fecha, producto, valor } = req.body;
  const record = {
    idCredito,
    fecha,
    producto,
    valor
  };

  if (isNumber(valor) && producto) {
    CreateRecordDB(record)
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
  } else {
    res.json({
      success: false,
      message: "introduce un valor valido o te falta el nombre del producto"
    });
  }
};
const GetRecord = (req, res) => {
  const idCredit = req.params.id;
  const page = req.params.page;
  GetAllRecordDB(idCredit, page)
    .then(result => {
      if (!result.data.length <= 0) {
        res.json({
          success: true,
          data: result.data
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

const DeletRecord = (req, res) => {
  const idRecord = req.params.id;
  DeleteRecordDB(idRecord).then(e => {
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

const UpdateRecord = (req, res) => {
  const { fecha, idRecord, producto, valor } = req.body;

  const updateRecord = {
    fecha,
    idRecord,
    producto,
    valor
  };
  UdateRecordDB(updateRecord)
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

  GetRecord,
  DeletRecord,
  UpdateRecord,
  CreateRecord

};
