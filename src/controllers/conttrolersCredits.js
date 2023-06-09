const { GetAllCustomers } = require("../services/creditsServies");

const CreateCustomers = () => {
    
}; 
const GetCustomers = (req, res) => {
  GetAllCustomers()
    .then(result => {
      if (result.length >= 0) {
        res.json({
          success: true,
          data: result
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
const DeletCustomers = () => {

}; 
const UpdateCustomers = () => {

};


module.exports = {
    GetCustomers,
    DeletCustomers,
    UpdateCustomers,
    CreateCustomers

}