const { CreatedeudaDB, GetAlldeudaDB, DeletedeudaDB, UpdatedeudaDB, findDeudaDB } = require("../services/deudasServices");

const CreateDeudas = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const { nombre, celular, date } = req.body;
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
  const idUsuario = req.usuario.id_usuario;
  const page = req.params.page;
  GetAlldeudaDB(idUsuario, page)
    .then(result => {
      if (!result.data.length <= 0) {
        /* const data = result.data.data;
        const saldo = result.data.saldoPendiente;

        const newData = data.map((item) => {
          const saldoPe = saldo.find(saldo => saldo.id_deuda === item.id_deuda);

          item.saldoPendiente = saldoPe ? parseInt(saldoPe.total_abonos) : 0;
          return { ...item };
        });
     */
        const newData = result.data.map(item => {
          const compra = result.compras.find(compra => compra.id_deuda === item.id_deuda);
          const abonos = result.abonos.find(abono => abono.id_deuda === item.id_deuda);

          item.saldoPendiente = parseInt(compra === undefined ? 0 : compra.compras) - parseInt(abonos === undefined ? 0 : abonos.abonos);
          item.compras = parseInt(compra === undefined ? 0 : compra.compras);
          item.abonos = parseInt(abonos === undefined ? 0 : abonos.abonos);

          return { ...item };
        });
        const totalCompras = result.compras.reduce((a, b) => {
          return parseInt(a) + parseInt(b.compras);
        }, 0);
        const totalabonos = result.abonos.reduce((a, b) => {
          return parseInt(a) + parseInt(b.abonos);
        }, 0);
        res.json({
          data: newData,
          paginas: result.paginas,
          totalDeudas: totalCompras - totalabonos,
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
  const idCustomer = req.params.id;
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
  const id = req.usuario.id_usuario;
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
