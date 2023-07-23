const Enemy = require("../models/Enemy");
const Food = require("../models/Food");
const Environment = require("../models/Environment");

const getAllEntorno = async (req, res) => {
  try {
    res.json({ status: 200, message: "🌱Este es tu entorno 🐜🐜🐜🐜" });
  } catch (e) {
    res.json({ status: 404, message: "Error 🐜🐜🐜🐜" });
  }
};

const setEntorno = async (req, res) => {
  try {
    res.json({ status: 200, message: "🌱Estas son tus hormigas 🐜🐜🐜🐜" });
  } catch (e) {
    res.json({ status: 404, message: "Error 🐜🐜🐜🐜" });
  }
};

// Función para borrar todos los enemigos existentes de la base de datos
async function deleteExistingEnvironment() {
  try {
    await Environment.deleteMany({});
    console.log("Datos eliminados con éxito.");
  } catch (error) {
    console.error("Error al eliminar datos: ", error);
  }
}

// Función para obtener un objeto aleatorio de un array
function getRandomObjectFromArray(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Función para generar el entorno inicial
async function generateInitialEnvironment() {
  try {
    const countEnvironment = await Environment.countDocuments();
    if (countEnvironment <= 0) {
      await deleteExistingEnvironment();
      // Obtener todos los objetos de alimentos y enemigos
      const allEnemies = await Enemy.find();
      const allFoods = await Food.find();

      // Crear un solo array con todos los datos de alimentos y enemigos
    const allData = [...allEnemies, ...allFoods];

    // Crear un array aleatorio mezclado de objetos de alimentos y enemigos
    const mixedData = [];
    while (allData.length > 0) {
      mixedData.push(getRandomObjectFromArray(allData));
      allData.splice(0, 1);
    }

      // Crea el entorno utilizando el modelo Environment
      const environmentData = new Environment({
        data: mixedData,
        mode: "medium", 
        antCost: 10, 
        environmentType: "jungle", 
      });

      // Guarda el entorno en la base de datos
      await environmentData.save();

      console.log("Entorno inicial generado con éxito 🐜");
    }else {
        console.log("🌱🐜🌱🍎🪲🦗 El entorno ya existe 🌱🐜🌱🍎🪲🦗");
      }
  } catch (error) {
    console.error("Error al generar el entorno inicial:", error);
  }
}

module.exports = { getAllEntorno, setEntorno, generateInitialEnvironment };
