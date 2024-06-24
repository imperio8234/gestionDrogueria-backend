const { getProductosMetricaDB, getcreditosMetricaDB, getdeudasMetricaDB, optenerComprasYventasDB, exportarDB } = require("../services/metricaServices");
const exelJs = require("exceljs");
const CrearExel = require("../toolsDev/crearExel");
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

const optenerComprasYventas = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const mes = req.params.mes;

  optenerComprasYventasDB(idUsuario, mes)
    .then((result) => {
      if (result.length <= 0) {
        res.status(404).json({
          message: "para actualizar los registros debes generar una venta o iniciar transacciones en el sistema, encaso contrario no hay registro para estas fechas ",
          success: false

        });
      } else {
        // Verificar si 'abonos' existe en result.creditos[0]
        const tieneAbonos = result.creditos[0]?.abonos !== undefined;
        // Verificar si 'saldoCreditos' existe en result.creditos[0]
        const tieneSaldoCreditos = result.creditos[0]?.saldoCreditos !== undefined;
     // console.log(compraTV[0].valor, comprasf[0].valor, abonoC[0].valor, abonoCom[0].valor, creditof[0].valor, comprasSinPagar[0].valor, compras[0].compras_totales, ventas, gastos[0].valor_gasto, creditos[0].valor  )

        const comprasTotalesV = parseInt(result.comprasTotalesV[0].valor);
        const creditosf = parseInt(result.creditof[0].valor);
        const comprasNoPagas = parseInt(result.comprasNoPagas[0].valor);
        const abonoC = parseInt(result.abonoC[0].valor);
        const abonoCom = parseInt(result.abonoCom[0].valor);

        res.status(200).json({
          message: "exito",
          success: true,
          data: [
            {
              compras_sin_pagar: (parseInt(result.comprasSinPagar[0].valor) + comprasNoPagas) - abonoCom,
              compras_totales: parseInt(result.compras[0].compras_totales) + comprasTotalesV,
              total_venta: result.ventas[0].total_venta,
              total_ganancia: result.ventas[0].total_ganancia,
              valor_gasto: result.gastos[0].valor_gasto,
              deuda_creditos:  (parseInt(result.creditos[0].valor) + creditosf) - abonoC,
              creditos_pagos:  abonoC
            }
          ]
        });
      }
    })
    .catch((err) => {
      console.log(err);
      if (err) {
        res.status(505).json({
          message: err,
          success: false
        });
      }
    });
};
// creacion de exel 
// eslint-disable-next-line no-return-assig
const exportar = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const fecha = req.params.fecha.split("-").reverse().join("/");
  exportarDB(fecha, idUsuario)
    .then(result => {
      if (!result.success) {
        res.status(404).json({
          message: "sin registros",
          success: false
        });
      } else {
        console.log(result)
         //variables que crean el libro y la hoja de exel
        // envio y modificacion del exel
        const workBook = new exelJs.Workbook();
        const workSheet = workBook.addWorksheet("worksheet");
       
        // retornar el libro exel
        const createWorkBook = CrearExel(workBook, workSheet, result, fecha);
        res.setHeader(
          "Content-type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename =" + "data.xlsx"
        );

        return createWorkBook.xlsx.write(res).then(() => {
          res.status(200).end();
        });
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        success: false,
        err,
        message: "error en el proceso"
      });
    });
};
module.exports = {
  getProductosMetrica,
  getcreditosMetrica,
  getdeudasMetrica,
  optenerComprasYventas,
  exportar
};
