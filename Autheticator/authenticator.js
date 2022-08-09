const validateFields = (user) => {
  const { email, password } = user;
  // REGEX LINK REFERENCE --> https://stackoverflow.com/questions/46155/how-can-i-validateFields-an-email-address-in-javascript

  const REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { message: 'O campo "email" é obrigatório' };
  }
  if (!REGEX.test(email)) {
    return { message: 'O "email" deve ter o formato "email@email.com"' };
  }
  if (!password) {
    return { message: 'O campo "password" é obrigatório' };
  }
  if (password.length < 6) {
    return { message: 'O "password" deve ter pelo menos 6 caracteres' };
  }
  return null;
};

module.exports = { validateFields };
