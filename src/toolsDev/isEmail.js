const isEmail = (email) => {
  const verify = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return verify.test(email);
}

module.exports = isEmail;
