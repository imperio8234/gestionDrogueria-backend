const { crearcajaDiariaDB, modificarcajaDiariaDB, optenercajaDiariaDB, eliminarcajaDiariaDB } = require("../services/cajaDiariaServices");
const getDate = require("../toolsDev/getDate");
const isNumber = require("../toolsDev/isNumber");
const random = require("../toolsDev/random");

const crearcajaDiaria = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const { efectivoInicial, fecha } = req.body;

  // verificacion de datos
  if (!efectivoInicial) {
    res.status(404).json({
      message: "el valor o descripcion son incompletos",
      success: false
    });
    return;
  } else if (!isNumber(efectivoInicial)) {
    res.status(404).json({
      message: "existe informacion erronea",
      success: false
    });
    return;
  }
  const cajaDiaria = {
    idcajaDiaria: random(1000, 9000),
    idUsuario,
    efectivoInicial,
    fecha
  };
    // introduccion de datos
  crearcajaDiariaDB(cajaDiaria)
    .then((result) => {
      if (result.success == false) {
        res.status(200).json({
          message: "no puedes crear mas",
          success: false
        })
        return;
      }
      res.status(200).json({
        message: "exito",
        success: true
      });
    })
    .catch((err) => {
      if (err) {
        res.status(505).json({
          success: false,
          message: "error",
          err
        });
      }
    });
};

const modificarcajaDiaria = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const data = req.body;

  modificarcajaDiariaDB(idUsuario, data)
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "se actualizo exitosamente",
          success: true
        });
      }
    })
    .catch((err) => {
      if (err) {
        res.status(505).json({
          message: "error",
          err,
          success: false
        });
      }
    });
};

const optenercajaDiaria = (req, res) => {
  const idUsuario =req.usuario.id_usuario;
  const fecha = req.params.fecha;
  const pagina = req.params.pagina;
  optenercajaDiariaDB(idUsuario, fecha, pagina)
    .then((result) => {
      if (result.success) {
        const compras = result.compras;
        const gastos = result.gastos;
        const creditosf = result.creditosf;
        const cajas = result.cajas;
        const abonosCompras = result.abonosCompras;
        const abonosCredito = result.abonosCredito;
          
        // modificacion de datos 
          const cajasCompletas = cajas.map(caja => {
          const gastosTotales = gastos.filter(gasto => gasto.fecha == caja.fecha);
          const valorGastos = gastosTotales.reduce((total, objeto) => total + objeto.valor_gasto, 0);

          const comprasTo = compras.filter(compra => compra.fecha == caja.fecha);
          const valorCompra = comprasTo.reduce((total, compra) => total + compra.valor,0);

          const creditosfTotal = creditosf.filter(credito => credito.fecha == caja.fecha);
          const valorCredito = creditosfTotal.reduce((total, credito) => total + credito.valor, 0);
          
          const abonosComprasTotal = abonosCompras.filter(abono => abono.fecha == caja.fecha);
          const valorAbonosCompra = abonosComprasTotal.reduce((total, abonoC) => total + abonoC.valor, 0);
          const abonosCreditoTotal = abonosCredito.filter(abono => abono.fecha == caja.fecha);
          const valorAbonosCredito = abonosCreditoTotal.reduce((total, abonoCre) => total + abonoCre.valor, 0);
        
          const totalDia = valorAbonosCredito +valorGastos + valorCompra + (!caja.efectivoCierre?0:caja.efectivoCierre -caja.efectivoInicial) + valorAbonosCompra;
          const efectivo = valorAbonosCredito + ((!caja.efectivoCierre?0:caja.efectivoCierre) - caja.efectivoInicial);
          caja.totalDia = totalDia;
          caja.gastosTotales = valorGastos;
          caja.valorCompras = valorCompra;
          caja.valorCredito = valorCredito;
          caja.efectivo = efectivo;
          caja.salidas = valorGastos + valorCompra + valorAbonosCompra;

        return {
          ...caja
        }
       });
       const totalMesActual = cajasCompletas.reduce((total, valor) => total + valor.totalDia,0);
        res.status(200).json({
          data: cajasCompletas,
          totalMesActual,
          success: true
        });
      }else {
        res.status(404).json({
          success:false,
          message: "no hay registros"
        })
      }
      
      

    })
    .catch((err) => {
      if (err) {
        res.status(505).json({
          message: err,
          success: false
        });
      }
    });
};

const eliminarcajaDiaria = (req, res) => {
  const idUsuario = req.usuario.id_usuario;
  const idcajaDiaria = req.params.id;
  eliminarcajaDiariaDB(idcajaDiaria, idUsuario)
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "se elimino exitosamente",
          success: true
        });
      }
    })
    .catch((err) => {
      if (err) {
        res.status(505).json({
          message: "error",
          err,
          success: false
        });
      }
    });
};

module.exports = {
  crearcajaDiaria,
  modificarcajaDiaria,
  optenercajaDiaria,
  eliminarcajaDiaria
};
