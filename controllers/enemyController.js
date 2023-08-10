const Enemy = require("../models/Enemy");
const { getRandomInt, getDificultyRange } = require("../helpers/helpers");

// Función para borrar todos los enemigos existentes de la base de datos
async function deleteExistingEnemies() {
  try {
    await Enemy.deleteMany({});
    console.log("Datos de enemigos existentes eliminados con éxito. 🗑️🐜");
  } catch (error) {
    console.error("Error al eliminar datos de enemigos existentes:", error);
  }
}

const createEnemy = async (eMode, environmentId) => {
  try {
      const enemiesData = generateEnemies(eMode, environmentId);
      await Enemy.insertMany(enemiesData);
      console.log("Enemigos creados con éxito. 🐛");
  } catch (error) {
    console.error("Error al insertar los datos de enemigos:", error);
  }
};

function generateEnemies(eMode, environmentId) {
  let antsRequired = getDificultyRange(eMode);
  const enemiesData = antEnemies.map((insect) => ({
    type: insect.type,
    name: insect.name,
    antsRequired: getRandomInt(antsRequired.min, antsRequired.max),
    timeRequired: getRandomInt(5000, 15000),
    completed: false,
    assigned: false,
    enviroment: environmentId
  }));

  return enemiesData;
}

const antEnemies = [
  {
    type: "enemy",
    name: "Avispa Malvada",
  },
  {
    type: "enemy",
    name: "Escarabajo Enfurecido",
  },
  {
    type: "enemy",
    name: "Mantis Religiosa",
  },
  {
    type: "enemy",
    name: "Mariposa Monarca",
  },
  {
    type: "enemy",
    name: "Araña Venenosa",
  },
  {
    type: "enemy",
    name: "Libélula Plateada",
  },
  {
    type: "enemy",
    name: "Grillo Loco",
  },
  {
    type: "enemy",
    name: "Araña Mortal",
  },
  {
    type: "enemy",
    name: "Cucaracha Veloz",
  },
  {
    type: "enemy",
    name: "Oruga Gigante",
  },
];

module.exports = { createEnemy };
