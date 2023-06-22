const random = (numberMin, numberMax) => {
  const number = Math.floor(Math.random() * numberMax) + numberMin;

  return number;
};

module.exports = random;
