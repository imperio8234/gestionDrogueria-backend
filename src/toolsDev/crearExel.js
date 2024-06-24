const { Style2, estilo1, StyleHeaders, efectivo } = require("./componentesCrearExel/estilosTablas");
const getDate = require("./getDate");
const getCurrentTime = require("./hora");
const Separador = require("./separacion");

const datosVentas = [
    { venta: 'Venta1', valor: 500000 },
    { venta: 'Venta2', valor: 750000 },
    { venta: 'Venta3', valor: 300000 },
    // Agrega los demás datos aquí
];
const CrearExel=(workBook, worksheet, data, fecha) => {
    //cabecera este codigo permite que se cree el exel 
    worksheet.columns = [
        { header: 'Ventas', key: 'venta' },
    ];
    
    // formateo de datos
    const valorTolalVentas = data.ventas.reduce((a, item) => a + item.total_venta, 0);
    const valorGastos = data.gastos.totalGastos?data.gastos.totalGastos:0;
    const valorCreditosf = data.creditosf.valorCreditosF?data.creditosf.valorCreditosF:0;
    const valorAbonosCompras = data.abonosCompras.valorAbonos?data.abonosCompras.valorAbonos:0;
    const valorAbonosCredito = data.abonosCredito.valorAbonosCredito?data.gastos.totalGastos:0;
    const valorCompras = data.compras.valorCompras?data.compras.valorCompras:0;

    // Añadir encabezado de la fecha del informe 
    worksheet.mergeCells('A1:P1');
   const informe = worksheet.getCell('A1');
    informe.value = `Fecha del informe ${getDate()} : ${getCurrentTime()}`;
    informe.style = estilo1;
    // Añadir el nombre de la empresa en A2:P2
    worksheet.mergeCells('A2:P2');
  const nombreNegocio =  worksheet.getCell('A2');
     nombreNegocio.value = "drogueria";
     nombreNegocio.style = estilo1;
    // Añadir la celda de fecha de venta en A4:C4
    const fechaVenta = fecha;
    worksheet.mergeCells('A4:C4');
    worksheet.getCell('A4').value = fechaVenta;
    worksheet.getCell('A4').numFmt = 'dd/mm/yyyy'; // Formato de fecha

    // añadir ventas
    worksheet.mergeCells('B6:C6');
    const valorVentas = worksheet.getCell("B6");
    const venta = worksheet.getCell("A6");
    worksheet.getCell("C6").style = StyleHeaders;
    valorVentas.value = "valor venta";
    venta.value = "venta";
    valorVentas.style = StyleHeaders;
    venta.style = StyleHeaders;

     data.ventas.forEach((venta, index) => {
        worksheet.mergeCells(`B${7+index}:C${7+index}`);
        const valorVentas = worksheet.getCell(`B${7+index}`);
        const Ventasid = worksheet.getCell(`A${7+index}`);
        
        valorVentas.value = Separador(venta.total_venta);
        Ventasid.value = venta.id_venta;
        worksheet.getCell(`C${7+index}`).style = Style2;

        valorVentas.style = Style2;
        Ventasid.style = Style2;

    });
    // devoluciones 

    worksheet.mergeCells('E6:F6');
    worksheet.mergeCells('G6:I6');
    const devolucion = worksheet.getCell('E6');
    const valorDevolucion = worksheet.getCell('G6');

    // nombres tabla devolucion
    devolucion.value = "devoluciones";
    valorDevolucion.value = "valor";

    devolucion.style = StyleHeaders;
    valorDevolucion.style = StyleHeaders;
    
    datosVentas.forEach((devolucion, index) => {
        worksheet.mergeCells(`E${7 + index}:F${7+index}`);
        worksheet.mergeCells(`G${7 + index}:I${7+index}`);
        const devolucionI = worksheet.getCell(`E${7+index}`);
        const valorDevolucion = worksheet.getCell(`G${7+index}`);
        
        // agregar los valores 
        devolucionI.value = devolucion.venta;
        valorDevolucion.value = devolucion.valor;
    });


    // tabla general
    //valor ventas dia 
    worksheet.mergeCells('K5:M5');
    worksheet.mergeCells('N5:P5');
    const nVentaDia = worksheet.getCell('K5')
    const valorVentaDia = worksheet.getCell('N5')
    nVentaDia.value = "valor ventas del dia";
    nVentaDia.style = StyleHeaders;
    valorVentaDia.value = Separador(valorTolalVentas);

    //gastos dia
    worksheet.mergeCells('K6:M6');
    worksheet.mergeCells('N6:P6');
    const gasto = worksheet.getCell('K6');
    const tablaValorGastos = worksheet.getCell('N6');
    gasto.value = "gastos";
    tablaValorGastos.value = Separador(valorGastos);
    gasto.style = StyleHeaders;

    //compras con caja
    worksheet.mergeCells('K7:M7');
    worksheet.mergeCells('N7:P7');
    const comprasCaja = worksheet.getCell('K7');
    const valorComprasCaja = worksheet.getCell('N7');

    comprasCaja.value = "compras efectivo caja";
    comprasCaja.style = StyleHeaders;
    valorComprasCaja.value = Separador(valorCompras);

    // abonos a compras
    worksheet.mergeCells('K8:M8');
    worksheet.mergeCells('N8:P8');
    const abonosComprasCaja = worksheet.getCell('K8');
    const valorAbonosCaja = worksheet.getCell('N8');

    abonosComprasCaja.value= "abonos a obligaciones";
    valorAbonosCaja.value = Separador(valorAbonosCompras);
    abonosComprasCaja.style = StyleHeaders;
    //
    //devoluciones
    worksheet.mergeCells('K9:M9');
    worksheet.mergeCells('N9:P9');
    const devolucionesDia = worksheet.getCell('K9');
    const valorDevoluciones = worksheet.getCell('N9');
    
    // abonos a creditos de clientes 
    worksheet.mergeCells('K10:M10');
    worksheet.mergeCells('N10:P10');
    const abonosClientes = worksheet.getCell('K10');
    const valorAbonoCliente = worksheet.getCell('N10');

    abonosClientes.value= "abonos de clientes ";
    valorAbonoCliente.value = Separador(valorAbonosCredito);
    abonosClientes.style = StyleHeaders;

    // creditos solicitados para el cliente 
    worksheet.mergeCells('K11:M11');
    worksheet.mergeCells('N11:P11');
    const creditosDeClientes = worksheet.getCell('K11');
    const valorCreditosDeClientes = worksheet.getCell('N11');

    creditosDeClientes.value= "abonos de clientes ";
    valorCreditosDeClientes.value = Separador(valorCreditosf);
    creditosDeClientes.style = StyleHeaders;

    //efectivo final 
    worksheet.mergeCells('K13:M13');
    worksheet.mergeCells('N13:P13');
    const efectivoFinal = worksheet.getCell('K13');
    const valorEfectivoFinal = worksheet.getCell('N13');

    efectivoFinal.value = "Efectivo final";
    valorEfectivoFinal.value =
    valorTolalVentas 
    ;

    efectivoFinal.style = efectivo;
    valorEfectivoFinal.style = efectivo; 
     
  
    // retornamos el libro cpn las hojas creadas 
   return workBook;
}

module.exports = CrearExel;