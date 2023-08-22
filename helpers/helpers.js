function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDificultyRange(eMode) {
  let min = 0;
  let max = 0;
  switch (eMode) {
    case "easy":
      min = 1;
      max = 3;
      break;
    case "medium":
      min = 4;
      max = 7;
      break;
    case "hard":
      min = 8;
      max = 10;
      break;
    default:
      min = 4;
      max = 7;
  }
  return {'min':min,'max':max}
}

// Función para obtener un objeto aleatorio de un array
function getRandomObjectFromArray(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return randomIndex;
}

module.exports = { getRandomInt, getRandomObjectFromArray, getDificultyRange };
