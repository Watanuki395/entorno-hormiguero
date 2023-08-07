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

const createEnemy = async (eMode,  isNew=false) => {
  try {
    const countEnemies = await Enemy.countDocuments();

    if (isNew || countEnemies === 0) {
      const enemiesData = generateEnemies(eMode);
      await deleteExistingEnemies();
      await Enemy.insertMany(enemiesData);
      console.log("Enemigos creados con éxito. 🐛");
    } else {
      console.log("Los enemigos ya existen 🐛");
    }
  } catch (error) {
    console.error("Error al insertar los datos de enemigos:", error);
  }
};

function generateEnemies(eMode) {
  let antsRequired = getDificultyRange(eMode);
  const enemiesData = antEnemies.map((insect) => ({
    type: insect.type,
    name: insect.name,
    antsRequired: getRandomInt(antsRequired.min, antsRequired.max),
    timeRequired: getRandomInt(5000, 15000),
    defeated: false,
    assigned: false
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
