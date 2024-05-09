const useverifyDate = (date) => {
  // Configurar la zona horaria a Colombia
  const opcionesFecha = { timeZone: 'America/Bogota' };

  // Obtener la fecha actual en la zona horaria de Colombia
  const fechaActual = new Date();
  const fechaActualColombia = new Date(fechaActual.toLocaleString('en-US', opcionesFecha));

  // Configurar la fecha de registro y la duración de la suscripción
  const fechaRegistro = new Date(date);
  const duracionSuscripcion = 30;

  // Obtener la fecha de vencimiento sumando la duración de la suscripción a la fecha de registro
  const fechaVencimiento = new Date(fechaRegistro);
  fechaVencimiento.setDate(fechaRegistro.getDate() + duracionSuscripcion);

  // Calcular los días restantes
  const diasRestantes = Math.ceil((fechaVencimiento - fechaActualColombia) / (1000 * 60 * 60 * 24));
  return diasRestantes;
};
module.exports = useverifyDate;
