// IMPORTACIONES
const Express = require("express");
const cors = require("cors");
// VARIABLES DE ENTORNO
const DB_PORT = process.env.DB_PORT || 2000;
/* const corsOptions={
    origin: "http://127.0.0.1:5500",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}; */

// EJECUCIONES

const app = Express();
// MIDELWARES
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cors());
// RUTAS
// rutas de inicio de sesion y registro
// rutas de inventario
const addProducts = require("./src/inventario/addProducts");
app.use("/addproducts", addProducts);
const getProducts = require("./src/inventario/getProducts");
app.use("/getproducts", getProducts);

const deleteProducto = require("./src/inventario/deleteProduct");
app.use("/deleteproduct", deleteProducto);

// rutas de creditos
const addcustomers = require("./src/creditos/addCustomers");
app.use("/addcustomers", addcustomers);

const getAllCustomers = require("./src/api-v1-routes/creditsRoutes");
app.use("/getcustomers", getAllCustomers);
//const getCustomers = require("./src/creditos/getCustomers");
//app.use("/getcustomers", getCustomers);

const addCredit = require("./src/creditos/addCredit");
app.use("/addcredit", addCredit);

const getCreditsRegistered = require("./src/creditos/getCreditsRegistered");
app.use("/getrecord", getCreditsRegistered);

const deleteCustomer = require("./src/creditos/deletedCustomer");
app.use("/deletecustomer", deleteCustomer);

const addSubtractRecord = require("./src/creditos/addSubtractRecord");
app.use("/subtractrecord", addSubtractRecord);

const editCustomer = require("./src/creditos/aditCustomer");
app.use("/editcustomer", editCustomer);
// rutas de deudas
// rutas de metrica
// PUERTO
app.listen(DB_PORT, () => {
  console.log("puerto en marcha en el puerto " + " " + DB_PORT);
});
