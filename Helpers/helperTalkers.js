const fs = require('fs/promises');

const allTalkers = async () => {
  const stringTalker = await fs.readFile('./talker.json');
  return [...JSON.parse(stringTalker)];
};

const searchForTalker = async (parameter, value) => {
  const allSpeakers = await allTalkers();

  if (parameter !== 'talk') {
    return allSpeakers
    .find((talker) => talker[parameter].toString() === value.toString());
  }
  return allSpeakers
  .find((talker) => JSON.stringify(talker[parameter]) === JSON.stringify(value));
};

const depurateTalkers = async (elem, value) => {
  const allSpeakers = await allTalkers();

  if (elem !== 'talk') {
    return allSpeakers.filter((talker) => `${talker[elem]}`.includes(`${value}`));
  }
  return null;
};

const getById = (id) => searchForTalker('id', id);

const totTalker = async (talker, id = null) => {
  const allSpeakers = await allTalkers();
  const talker1 = talker;
  talker1.id = Number(id || allSpeakers.length + 1);
  allSpeakers.push(talker1);
  await fs.writeFile('./talker.json', JSON.stringify(allSpeakers));
};

const delTalker = async (id) => {
  const allSpeakers = await allTalkers();
  const talker2 = allSpeakers.filter((talker) => talker.id.toString() !== id.toString());
  await fs.writeFile('./talker.json', JSON.stringify(talker2));
};

const upTalker = async (id, talker) => {
  await delTalker(id);
  await totTalker(talker, id);
};

module.exports = {
  allTalkers,
  getById,
  searchForTalker,
  depurateTalkers,
  totTalker,
  upTalker,
  delTalker,
};