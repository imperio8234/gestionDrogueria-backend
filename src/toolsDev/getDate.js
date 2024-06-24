const getDate = (date) => {
  const localDate = new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' });

  let localDate2;
  if (date) {
    // Suponiendo que date viene en formato DD/MM/YYYY
    const [day, month, year] = date.split('/');
    const formattedDate = `${year}-${month}-${parseInt(day) + 1}`; // Convertir a formato YYYY-MM-DD
    console.log(formattedDate)
    localDate2 = new Date(formattedDate).toLocaleDateString('es-CO', { timeZone: 'America/Bogota' });
  }

  return date ? localDate2 : localDate;
};

module.exports = getDate;
