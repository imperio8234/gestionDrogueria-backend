const { GetAllCustomersDB, CreateCustomersDB, UdateCustomersDB, DeleteCustomersDB } = require("../services/creditsServies");

const CreateCustomers = (req, res) => {
  const { idUsuario, nombre, phoneNumber, date } = req.body;
  const customer = {
    idUsuario,
    nombre,
    phoneNumber,
    date
  };

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
};
const GetCustomers = (req, res) => {
  const id = req.params.id;
  const page = req.params.page;
  GetAllCustomersDB(id, page)
    .then(result => {
      if (result.data.data.length >= 0) {
        res.json({
          success: true,
          data: result.data,
          paginas: result.paginas
        });
      } else {
        res.json({
          message: "no hay clentes registrados",
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
    fecha,
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

module.exports = {

  GetCustomers,
  DeletCustomers,
  UpdateCustomers,
  CreateCustomers

};
