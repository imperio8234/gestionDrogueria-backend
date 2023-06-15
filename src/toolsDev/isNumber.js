const isNumber = (data) => {
  const verify = /^[0-9]+$/;
  return verify.test(data);
};

module.exports = isNumber;
