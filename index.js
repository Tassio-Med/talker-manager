const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
// não remover acima

const TALKER_JSON = './talker.json';

app.get('/talker', async (_req, res) => {
  const stringTalker = await fs.readFile(TALKER_JSON, 'utf-8');
  const jsonTalker = JSON.parse(stringTalker);
  res.status(HTTP_OK_STATUS).send(jsonTalker);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const stringTalker = await fs.readFile(TALKER_JSON, 'utf-8');
  const jsonTalker = [
    ...JSON.parse(stringTalker),
  ];
  const talkerResult = jsonTalker.find((talker) => talker.id === Number(id));
  if (!talkerResult) {
    res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  res.status(HTTP_OK_STATUS).json(talkerResult);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const MANDATORY_EMAIL = { message: 'O campo "email" é obrigatório' };
  const EMAIL_FORMAT = { message: 'O "email" deve ter o formato "email@email.com"' };
  const MANDATORY_PASSWORD = { message: 'O campo "password" é obrigatório' };
  const MIN_PASSWORD = { message: 'O "password" deve ter pelo menos 6 caracteres' };
  const REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // REGEX LINK REFERENCE --> https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
  if (!email) res.status(400).json(MANDATORY_EMAIL); 
  
  if (!REGEX.test(email)) res.status(400).json(EMAIL_FORMAT); 
  
  if (!password) res.status(400).json(MANDATORY_PASSWORD); 

  if (password.length < 6) res.status(400).json(MIN_PASSWORD); 

  const token = crypto.randomBytes(8).toString('hex');
  res.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});