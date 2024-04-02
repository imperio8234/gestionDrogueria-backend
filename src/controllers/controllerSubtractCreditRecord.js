const {
  GetAllsubtractCreditRecordDB,
  updatesubtractCreditRecordDB,
  deletesubtractCreditRecordDB,
  createsubtractCreditRecordDB
} = require("../services/subtractCreditRecordServices");
const getDate = require("../toolsDev/getDate");
const isNumber = require("../toolsDev/isNumber");

const GetAllsubtractCreditRecord = (req, res) => {
  const idCredit = req.params.id;
  const page = req.params.page;
  GetAllsubtractCreditRecordDB(idCredit, page)
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
          message: "error al obener los datos",
          err
        });
      }
    });
};
const updatesubtractCreditRecord = (req, res) => {
  const { idRecord, valor } = req.body;
  const updateRecord = {
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
  const idUsuario = req.usuario.id_usuario;
  const { idCredito, fecha, valor } = req.body;
  const record = {
    idCredito,
    fecha: getDate(),
    valor
  };

  if (idCredito && isNumber(valor) && fecha) {
    createsubtractCreditRecordDB(record, idUsuario)
      .then(result => {
        if (result.success) {
          res.json({
            message: "se guardo exitosamente",
            success: true
          });
        } else {
          res.json({
            message: result.message,
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
      message: "corrige el valor"
    });
  }
};

module.exports = {
  createsubtractCreditRecord,
  deletesubtractCreditRecord,
  updatesubtractCreditRecord,
  GetAllsubtractCreditRecord
};
