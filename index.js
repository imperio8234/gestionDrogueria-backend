// IMPORTACIONES
const Express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");



// Carga las variables de entorno desde el archivo correspondiente
require('dotenv').config();
// VARIABLES DE ENTORNO
const DB_PORT = process.env.PORT;
const corsOptions = {
  origin: "http://localhost:5173", 
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// EJECUCIONES

const app = Express();
// MIDELWARES
app.use(cookieParser());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// RUTAS
app.use("/api/v1", require("./src/api-v1-routes/index"));

app.listen(DB_PORT, async () => {
  await console.log("puerto en marcha en el puerto " + " " + DB_PORT);
});

module.exports = app