const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const helperTalkers = require('./Helpers/helperTalkers');
const validator = require('./Autheticator/validator');
const authenticator = require('./Autheticator/authenticator');
const handlerAllow = require('./Handlers/handlerAllow');

const { allTalkers, getById, totTalker, upTalker, delTalker, depurateTalkers } = helperTalkers;
const { authenticValidator } = validator;
const { validateFields } = authenticator;

// allTalkers, getById, upTalker, delTalker, depurateTalkers, totTalker 

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const NOT_FOUND = { message: 'Pessoa palestrante não encontrada' };

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
// NÃO REMOVER CAMPO ACIMA

app.get('/talker/search', handlerAllow, async (req, res) => {
  const { q } = req.query;
  let result = [];
  if (!q) {
    result = await allTalkers();
  } else {
    result = await depurateTalkers('name', q);
  }
  return res.status(HTTP_OK_STATUS).send(result);
});

app.get('/talker', async (_req, res) => {
  const talkerJson = await allTalkers();
  return res.status(HTTP_OK_STATUS).send(talkerJson);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  
  const talker = await getById(id);

  if (!talker) {
    return res.status(404).json(NOT_FOUND); 
  }
  return res.status(HTTP_OK_STATUS).json(talker);
});

app.post('/login', (req, res) => {
  const user = req.body;

  if (validateFields(user)) {
    return res.status(400).json(validateFields(user));
  }
  const token = crypto.randomBytes(8).toString('hex');
  res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker', handlerAllow, authenticValidator, async (req, res) => {
  const { talker } = req;
  await totTalker(talker);
  return res.status(201).json(talker);
});

app.put('/talker/:id', handlerAllow, authenticValidator, async (req, res) => {
  const { talker, params: { id } } = req;
  await upTalker(id, talker);
  return res.status(HTTP_OK_STATUS).json(talker);
});

app.delete('/talker/:id', handlerAllow, async (req, res) => {
  const { id } = req.params;
  await delTalker(id);
  return res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});