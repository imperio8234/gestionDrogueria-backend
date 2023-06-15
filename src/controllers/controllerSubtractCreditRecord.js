const {
  GetAllsubtractCreditRecordDB,
  updatesubtractCreditRecordDB,
  deletesubtractCreditRecordDB,
  createsubtractCreditRecordDB
} = require("../services/subtractCreditRecordServices");

const GetAllsubtractCreditRecord = (req, res) => {
  const idCredit = req.params.id;
  GetAllsubtractCreditRecordDB(idCredit)
    .then(result => {
      if (!result.length <= 0) {
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
const updatesubtractCreditRecord = (req, res) => {
  const { fecha, idRecord, valor } = req.body;
  const updateRecord = {
    fecha,
    idRecord,
    valor
  };
  updatesubtractCreditRecordDB(updateRecord)
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
const deletesubtractCreditRecord = (req, res) => {
  const idRecord = req.params.id;
  deletesubtractCreditRecordDB(idRecord).then(e => {
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
const createsubtractCreditRecord = (req, res) => {
  const { idCredito, fecha, valor } = req.body;
  const record = {
    idCredito,
    fecha,
    valor
  };

  createsubtractCreditRecordDB(record)
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

module.exports = {
  createsubtractCreditRecord,
  deletesubtractCreditRecord,
  updatesubtractCreditRecord,
  GetAllsubtractCreditRecord
};
