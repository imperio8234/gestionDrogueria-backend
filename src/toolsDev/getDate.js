const getDate = () => {
  // eslint-disable-next-line quotes
  const localDate = new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' });;
  return localDate;
}

module.exports = getDate;
