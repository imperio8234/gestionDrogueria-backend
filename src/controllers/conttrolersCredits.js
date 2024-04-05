const { GetAllCustomersDB, CreateCustomersDB, UdateCustomersDB, DeleteCustomersDB, findCustomersDB } = require("../services/creditsServies");
const getDate = require("../toolsDev/getDate");
const isNumber = require("../toolsDev/isNumber");

const CreateCustomers = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const { nombre, phoneNumber, date } = req.body;
  const customer = {
    idUsuario,
    nombre,
    phoneNumber,
    date: getDate()
  };

  if (idUsuario && isNumber(phoneNumber) && nombre) {
    CreateCustomersDB(customer)
      .then(result => {
        if (result) {
          res.json({
            message: "se guardo exitosamente",
            success: true
          });
        } else {
          res.json({
            message: "el cliente ya esta registrado",
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
      message: "algunos de los datos son incorrectos o faltantes"
    });
  }
};
const GetCustomers = (req, res) => {
  const id = req.usuario.id_usuario;
  const page = req.params.page;
  GetAllCustomersDB(id, page)
    .then(result => {
      if (!result.data.length <= 0) {
        const vCompra = result.vCompra;
        const vAbonos = result.vAbonos;
        const creditos = result.data;
        const creditosf = result.creditosf

        for (let i = 0; i < creditos.length; i++) {
          const ValorAbonos = vAbonos.find(abono => abono.id_credito === creditos[i].id_credito);
          const valorCompras = vCompra.find(compra => compra.id_credito === creditos[i].id_credito);
          const valorCreditof = creditosf.find(credito => credito.id_credito === creditos[i].id_credito);
          creditos[i].saldo =
           (parseInt(valorCompras !== undefined ? valorCompras.valorCompras : 0) + (parseInt(valorCreditof !== undefined ? valorCreditof.valor : 0)))
            -
           parseInt(ValorAbonos !== undefined ? ValorAbonos.valorAbonos : 0);
          creditos[i].abonos = ValorAbonos !== undefined ? ValorAbonos.valorAbonos : 0;
          creditos[i].compras = valorCompras !== undefined ? valorCompras.valorCompras : 0;
        }
        res.json({
          success: true,
          data: result,
          paginas: result.paginas
        });
      } else {
        res.json({
          message: "no hay clientes registrados",
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

const DeletCustomers = (req, res) => {
  const idCustomer = req.params.idcustomer;
  DeleteCustomersDB(idCustomer).then(e => {
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
        message: "aun hay registros"
      });
    }
  });
};

const UpdateCustomers = (req, res) => {
  const { nombre, idCredito, fecha, celular } = req.body;

  const updateCustomer = {
    nombre,
    idCredito,
    fecha: getDate(),
    celular
  };
  UdateCustomersDB(updateCustomer)
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

const findCustomers = (req, res) => {
  const id = req.usuario.id_usuario;
  const words = req.params.words;

  findCustomersDB(id, words)
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

  GetCustomers,
  DeletCustomers,
  UpdateCustomers,
  CreateCustomers,
  findCustomers

};
