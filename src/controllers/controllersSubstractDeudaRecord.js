const {
  GetAllsubtractDeudaRecordDB,
  updatesubtractDeudaRecordDB,
  deletesubtractDeudaRecordDB,
  createsubtractDeudaRecordDB
} = require("../services/servicesSubstrectDeudaRecord");
const getDate = require("../toolsDev/getDate");

const GetAllsubtractDeudaRecord = (req, res) => {
  const idDeuda = req.params.id;
  const page = req.params.page;
  const idUsuario = req.usuario.id_usuario;
  GetAllsubtractDeudaRecordDB(idDeuda, idUsuario, page)
    .then(result => {
      if (result.success) {
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
const updatesubtractDeudaRecord = (req, res) => {
  const {  idAbono, valor } = req.body;
  const updateRecord = {
    idAbono,
    valor
  };
  updatesubtractDeudaRecordDB(updateRecord)
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
const deletesubtractDeudaRecord = (req, res) => {
  const idRecord = req.params.id;
  deletesubtractDeudaRecordDB(idRecord).then(e => {
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
const createsubtractDeudaRecord = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const { idDeuda, fecha, valor } = req.body;
  const record = {
    idUsuario,
    idDeuda,
    fecha,
    valor
  };
  if (valor < 0) {
    res.status(401).json({
      success: false,
      message: "existen valores negativos"
    });
    return;
  }
  createsubtractDeudaRecordDB(record)
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
};

module.exports = {
  createsubtractDeudaRecord,
  deletesubtractDeudaRecord,
  updatesubtractDeudaRecord,
  GetAllsubtractDeudaRecord
};
