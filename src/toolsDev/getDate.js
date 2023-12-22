const getDate = () => {
  // eslint-disable-next-line quotes
  const localDate = new Date().toLocaleDateString('co-CO');
  return localDate;
}

module.exports = getDate;
