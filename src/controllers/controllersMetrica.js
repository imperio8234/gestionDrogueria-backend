const { getProductosMetricaDB, getcreditosMetricaDB, getdeudasMetricaDB, optenerComprasYventasDB, exportarDB } = require("../services/metricaServices");
const exelJs = require("exceljs");
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
        res.status(200).json({
          message: "exito",
          success: true,
          data: [
            {
              compras_sin_pagar: parseInt(result.comprasSinPagar[0].valor),
              compras_totales: result.compras[0].compras_totales,
              total_venta: result.ventas[0].total_venta,
              total_ganancia: result.ventas[0].total_ganancia,
              valor_gasto: result.gastos[0].valor_gasto,
              deuda_creditos: tieneSaldoCreditos ? result.creditos[0].saldoCreditos : 0,
              creditos_pagos: tieneAbonos ? result.creditos[0].abonos : 0
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

// eslint-disable-next-line no-return-assign
const exportar = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const fecha = req.params.fecha.split("-").reverse().join("/");
  exportarDB(fecha, idUsuario)
    .then(result => {
      if (result.gastos.length < 0 || result.ventas.length < 0) {
        res.status(404).json({
          message: "sin registros",
          success: false
        });
      } else {
        // recoleccion de headers de los distintos cuadros
        // eslint-disable-next-line no-return-assign
        const headers = result.ventas.reduce((acc, obj) => acc = Object.getOwnPropertyNames(obj), []);
        // eslint-disable-next-line no-return-assign
        const gastos = result.gastos.reduce((acc, obj) => acc = Object.getOwnPropertyNames(obj), []);

        // envio y modificacion del exel
        const exporData = (data) => {
          const workBook = new exelJs.Workbook();
          const workSheet = workBook.addWorksheet("worksheet");
          // informacion de comprobante
          workSheet.getCell("A1").value = req.usuario.nombreNegocio;
          workSheet.getCell("A2").value = `fecha de comprobante : ${new Date().toLocaleString()}`;
          workSheet.mergeCells("A1:J1");
          workSheet.mergeCells("A2:J2");

          // columna de fecha del cierre de venta
          workSheet.getCell("A4").value = "Fecha del cierre diario";
          workSheet.getCell("A5").value = fecha;
          workSheet.mergeCells("A4:C4");
          workSheet.mergeCells("A5:C5");

          // productos vendidos encabezados
          workSheet.spliceRows(8, 0, headers);

          // insercion de gastos
          /* result.gastos.forEach((dato, index) => {
            const rowIndex = index + 11;
            const row = workSheet.getCell(`J${rowIndex}`)
            row.value = dato;
          }) */

          // insercion de prodctos vendidos
          result.ventas.forEach((dato, index) => {
            const rowIndex = index + 9; // Comenzar desde la fila 9
            workSheet.addRow([dato.producto, dato.cantidad, dato.laboratorio, dato.IVA, dato.valorProductos, dato.precio, dato.costo], `A${rowIndex}`);
          });

          // ESTILO  DE CELDAS
          const Style = {
            border: {
            },
            fill: {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFD3D3D3" } // Código de color gris claro en formato ARGB
            },
            alignment: {
              vertical: "middle", // Centrar verticalmente
              horizontal: "center" // Centrar horizontalmente
            }
          };
          const Style2 = {
            border: {
            },
            fill: {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFFFFF" }
            },
            alignment: {
              vertical: "middle", // Centrar verticalmente
              horizontal: "center" // Centrar horizontalmente
            }
          };
          workSheet.columns.forEach(columna => {
            columna.width = 20;
          });

          // gastos encabezados
          gastos.forEach((dato, index) => {
            const rowIndex = index + 9;
            const row = workSheet.getCell(`I${rowIndex}`);
            row.value = dato;
            row.style = Style;
          });

          // optencion de celdas para dar estilos
          const informacionComprobante = workSheet.getCell("A1");
          const informacionComprobante2 = workSheet.getCell("A2");
          const fechaDia = workSheet.getCell("A4");
          const fechaDia2 = workSheet.getCell("A5");
          workSheet.getCell("A8").style = Style;
          workSheet.getCell("B8").style = Style;
          workSheet.getCell("C8").style = Style;
          workSheet.getCell("D8").style = Style;
          workSheet.getCell("E8").style = Style;
          workSheet.getCell("F8").style = Style;
          workSheet.getCell("G8").style = Style;
          informacionComprobante.style = Style;
          informacionComprobante2.style = Style;
          fechaDia.style = Style;
          fechaDia2.style = Style2;

          return workBook;
        };
        // retornar el libro exel
        const workBook = exporData();
        res.setHeader(
          "Content-type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename =" + "data.xlsx"
        );

        return workBook.xlsx.write(res).then(() => {
          res.status(200).end();
        });
      }
    })
    .catch((err) => {
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
