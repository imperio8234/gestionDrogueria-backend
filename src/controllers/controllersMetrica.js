const { getProductosMetricaDB, getcreditosMetricaDB, getdeudasMetricaDB } = require("../services/metricaServices");

const getProductosMetrica = (req, res) => {
  const idUsuario = req.params.id;

  getProductosMetricaDB(idUsuario)
    .then(result => {
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      }
    })
    .catch(err => {
      res.json({
        success: false,
        err
      });
    });
};
const getcreditosMetrica = (req, res) => {
  const idUsuario = req.params.id;
  getcreditosMetricaDB(idUsuario)
    .then(result => {
      if (result.success) {
        res.json({
          deudas: result.creditos,
          totalDeudas: result.total,
          success: true
        });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).json({
          message: "ocurrio un error",
          err
        });
      }
    });
};
const getdeudasMetrica = (req, res) => {
  const idUsuario = req.params.id;
  getdeudasMetricaDB(idUsuario)
    .then(result => {
      if (result.success) {
        res.json({
          deudas: result.deudas,
          totalDeudas: result.total,
          success: true
        });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).json({
          message: "ocurrio un error",
          err
        });
      }
    });
};

module.exports = {
  getProductosMetrica,
  getcreditosMetrica,
  getdeudasMetrica
};
