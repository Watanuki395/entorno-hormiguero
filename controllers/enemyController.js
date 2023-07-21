const Enemy = require("../models/Enemy");

// Función para borrar todos los enemigos existentes de la base de datos
async function deleteExistingEnemies() {
  try {
    await Enemy.deleteMany({});
    console.log("Datos de enemigos existentes eliminados con éxito.");
  } catch (error) {
    console.error("Error al eliminar datos de enemigos existentes:", error);
  }
}

const createEnemy = async () => {
  try {
    const enemiesData = generateEnemies();
    const countEnemies = await Enemy.countDocuments();

    if (countEnemies <= 0) {
      await deleteExistingEnemies();
      await Enemy.insertMany(enemiesData);
      console.log("Datos de enemigos insertados con éxito.");
    } else {
      console.log("Los enemigos ya existen 🐛");
    }
  } catch (error) {
    console.error("Error al insertar los datos de enemigos:", error);
  }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEnemies() {
  const enemiesData = antEnemies.map((insect) => ({
    type: insect.type,
    name: insect.name,
    antsRequired: getRandomInt(1, 7),
    timeRequired: getRandomInt(5000, 15000),
    defeated: false,
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
    type: "Libélula",
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
