const nameValidator = (name) => {
  const MANDATORY_NAME = { message: 'O campo "name" é obrigatório' };
  const MIN_NAME = { message: 'O "name" deve ter pelo menos 3 caracteres' };
 
  if (!name) {
    return MANDATORY_NAME;
  }
  if (name.length < 3) {
    return MIN_NAME;
  }
  return null;
};
 
const ageValidator = (age) => {
  const MANDATORY_AGE = { message: 'O campo "age" é obrigatório' };
  const MAJOR = { message: 'A pessoa palestrante deve ser maior de idade' };

  if (!age) {
    return MANDATORY_AGE;
  }
  if (age < 18) {
    return MAJOR;
  }
  return null;
};
const watchedAtValidator = (talk) => {
  // REGEX DATA REFERENCE LINK--> https://stackoverflow.com/questions/62960834/regex-date-dd-mm-yyyy
  const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;

  if (!talk.watchedAt) {
    return { message: 'O campo "watchedAt" é obrigatório' };
  }
  if (!talk.watchedAt.match(dateRegex)) {
    return { message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' };
  }
  return null;
};

const rateValidator = (talk) => {
  if (talk.rate === undefined) {
    return { message: 'O campo "rate" é obrigatório' };
  }
  if (talk.rate < 1 || talk.rate > 5) {
    return { message: 'O campo "rate" deve ser um inteiro de 1 à 5' };
  }
  if (!Number.isInteger(talk.rate)) {
    return { message: 'O campo "rate" deve ser um inteiro de 1 à 5' };
  }
  return null;
};
 
const talkValidator = (talk) => {
  if (!talk) {
    return { message: 'O campo "talk" é obrigatório' };
  }
  if (watchedAtValidator(talk)) {
    return watchedAtValidator(talk);
  }
  if (rateValidator(talk)) {
    return rateValidator(talk);
  }
  return null;
};
 
const authenticValidator = (req, res, next) => {
  const { name, age, talk } = req.body;
 
  if (nameValidator(name)) return res.status(400).json(nameValidator(name));
  if (ageValidator(age)) return res.status(400).json(ageValidator(age));
  if (talkValidator(talk)) return res.status(400).json(talkValidator(talk));

  req.talker = { name, age, talk };
  next();
};
 
module.exports = { authenticValidator };
