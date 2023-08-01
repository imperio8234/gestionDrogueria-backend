// IMPORTACIONES
const Express = require("express");
const cors = require("cors");
// VARIABLES DE ENTORNO
const DB_PORT = process.env.DB_PORT || 5000;
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
app.use("/api/v1", require("./src/api-v1-routes/index"));

app.listen(DB_PORT, () => {
  console.log("puerto en marcha en el puerto " + " " + DB_PORT);
});
