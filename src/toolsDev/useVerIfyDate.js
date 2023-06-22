const useverifyDate = (fecha, dia) => {
  const fecha1 = new Date(fecha);
  const date30DaysLater = new Date();
  date30DaysLater.setDate(dia + 30);

  const dateDifference = fecha1 - date30DaysLater;

  const remainingDays = Math.floor(dateDifference / (1000 * 60 * 60 * 24));
  return Math.abs(remainingDays);
};

module.exports = useverifyDate;
