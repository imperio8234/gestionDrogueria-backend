const { getProductosMetricaDB, getcreditosMetricaDB, getdeudasMetricaDB } = require("../services/metricaServices");

const getProductosMetrica = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  getProductosMetricaDB(idUsuario)
    .then(result => {
      if (result.success) {
        const precio = [].concat(...result.low.map(item => parseInt(item.precio))).reduce((a, b) => a + b, 0);
        const costo = [].concat(...result.low.map(item => parseInt(item.costo))).reduce((a, b) => a + b, 0);
        const productLow = result.low.filter(item => parseInt(item.unidades) <= 1);
        const productos = [{ precios: precio, costos: costo, productlow: productLow, ganancia: precio - costo }];
        res.json({
          success: true,
          data: productos
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
  const idUsuario = req.usuario.id_usuario;

  getcreditosMetricaDB(idUsuario)
    .then(result => {
      if (result.success) {
        // procesar los datos
        const obj = () => {
          const operacion = result.clientesdb.map(cliente => {
            const abono = result.abonos.filter(abono => abono.id_credito === cliente.id_credito);
            const totalAbono = [].concat(...abono.map(valor => parseInt(valor.valor)));

            const sumas = result.sumas.filter(suma => suma.id_credito === cliente.id_credito);
            const totalSuma = [].concat(...sumas.map(valor => parseInt(valor.valor)));

            const abonosTotales = totalAbono.reduce((a, b) => {
              return a + b;
            }, 0);

            const sumasTotales = totalSuma.reduce((a, b) => {
              return a + b;
            }, 0);

            return { ...cliente, total: sumasTotales - abonosTotales };
          });
          return operacion;
        };
        const clientesProcesados = obj();
        const ClientesDeudores = clientesProcesados;

        const creditos = [].concat(...clientesProcesados.map(valor => valor.total));
        res.json({
          success: true,
          mayoresCreditos: ClientesDeudores.filter(cliente => cliente.total !== 0),
          totalCreditos: creditos.reduce((a, b) => {
            return a + b;
          }, 0)
        });
      } else {
        res.json({
          message: "no hay registros",
          success: false
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
  const idUsuario = req.usuario.id_usuario;

  getdeudasMetricaDB(idUsuario)
    .then(result => {
      if (result.success) {
        // procesar los datos
        const obj = () => {
          const operacion = result.deudasdb.map(deuda => {
            const abono = result.abonos.filter(abono => abono.id_credito === deuda.id_credito);
            const totalAbono = [].concat(...abono.map(valor => valor.valor));

            const sumas = result.sumas.filter(suma => suma.id_credito === deuda.id_credito);
            const totalSuma = [].concat(...sumas.map(valor => parseInt(valor.valor)));

            const abonosTotales = totalAbono.reduce((a, b) => {
              return a + b;
            }, 0);

            const sumasTotales = totalSuma.reduce((a, b) => {
              return a + b;
            }, 0);

            return { ...deuda, total: sumasTotales - abonosTotales };
          });
          return operacion;
        };
        const deudasProcesados = obj();
        const ClientesDeudores = deudasProcesados;

        const deudas = [].concat(...deudasProcesados.map(valor => valor.total));

        res.json({
          success: true,
          mayoresDeudas: ClientesDeudores.filter(deuda => deuda.total !== 0),
          totalDeudas: deudas.reduce((a, b) => {
            return a + b;
          }, 0)
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
