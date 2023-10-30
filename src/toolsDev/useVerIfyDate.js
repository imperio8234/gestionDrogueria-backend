const useverifyDate = (date) => {
  const fechaRegistro = new Date(date);

  const duracionSuscripcion = 30;

  const fechaActual = new Date();

  const fechaVencimiento = new Date(fechaRegistro);
  fechaVencimiento.setDate(fechaRegistro.getDate() + duracionSuscripcion);

  const diasRestantes = Math.ceil((fechaVencimiento - fechaActual) / (1000 * 60 * 60 * 24));
  return diasRestantes;
};

module.exports = useverifyDate;
