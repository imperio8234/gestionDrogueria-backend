const sql = require("mysql2");

// avariables
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER ;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME ;
const DB_PORT = process.env.DB_PORT;

const conexion = sql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME
});

conexion.connect((error) => {
  if (error) {
    console.log("error al acceder a la base de datos");
  } else {
    console.log("conexiona la base de datos exitosa");
  }
});

module.exports = conexion;
