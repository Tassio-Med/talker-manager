const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

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

app.listen(PORT, () => {
  console.log('Online');
});