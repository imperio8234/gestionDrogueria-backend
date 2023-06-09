
const conexion = require("../toolsDev/midelware/bd_conection")

const GetAllCustomers = () => {
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM creditos", (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

const DeleteCustomers = () => {

}

const UdateCustomers = () => {

}

const CreateCustomers = () => {

}

module.exports = {
  GetAllCustomers,
  DeleteCustomers,
  UdateCustomers,
  CreateCustomers
};
