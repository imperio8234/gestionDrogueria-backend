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
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    }
  };
// Estilo con bordes, texto centrado y color gris claro
const estilo1 = {
    border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    },
    alignment: { vertical: 'middle', horizontal: 'center' },
    fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' } // Gris claro
    }
};

const StyleHeaders = {
    fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' } // Gris claro
    },
   
};

const efectivo = {
    border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    },
    font: { size: 20 },
    fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' } // Gris claro
    }
};

module.exports= {
    Style,
    Style2,
    estilo1,
    StyleHeaders,
    efectivo
}