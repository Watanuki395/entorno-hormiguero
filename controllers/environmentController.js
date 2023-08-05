const Enemy = require("../models/Enemy");
const Food = require("../models/Food");
const Environment = require("../models/Environment");
const { createEnemy } = require("./enemyController");
const { createFood } = require("./foodController");
const { getRandomObjectFromArray, getRandomInt, getDificultyRange } = require("../helpers/helpers");

const getFullEnvironment = async (req, res) => {
  try {
    const countEnvironment = await Environment.countDocuments();
    if (countEnvironment > 0) {
      const getAllEnvironment = await Environment.find();
      res.json({ status: 200, environment: getAllEnvironment[0]});
    }

  } catch (e) {
    res.json({ status: 404, message: `Error: ${e}` });
  }
};

const setNewEnvironment = async (req, res) => {
  try {
    const {eMode, environmentType} = req.body

    await createFood(eMode, true);

    await createEnemy(eMode, true);

    await createEnvironment(eMode, environmentType, true)

    const getAllEnvironment = await Environment.find();

    res.json({ status: 200, message: `Nuevo entorno creado con exito en modo: ${eMode}`, environment: getAllEnvironment[0] });
  } catch (e) {
    res.json({ status: 404, message: "Error 🐜🐜🐜🐜" });
  }
};

// Función para borrar todos los enemigos existentes de la base de datos
async function deleteExistingEnvironment() {
  try {
    await Environment.deleteMany({});
    console.log("Datos del entorno eliminados con éxito. 🗑️🐜");
  } catch (error) {
    console.error("Error al eliminar datos: ", error);
  }
}

// Función para generar el entorno inicial
async function createEnvironment(eMode, environmentType,  isNew=false) {
  try {
    const countEnvironment = await Environment.countDocuments();
    if (isNew || countEnvironment === 0) {
      // Borramos el entorno existente
      await deleteExistingEnvironment();
      // Obtener todos los objetos de alimentos y enemigos
      const allEnemies = await Enemy.find();
      const allFoods = await Food.find();

      // Crear un solo array con todos los datos de alimentos y enemigos
      const allData = [...allEnemies, ...allFoods];

      // Crear un array aleatorio mezclado de objetos de alimentos y enemigos
      const mixedData = [];
      while (allData.length > 0) {
        const randomIndex = getRandomObjectFromArray(allData)
        mixedData.push( allData[randomIndex]);
        allData.splice(randomIndex, 1);
      }

      let antCostRange = getDificultyRange(eMode);

      // Crea el entorno utilizando el modelo Environment
      const environmentData = new Environment({
        data: mixedData,
        mode: eMode ? eMode : 'medium', 
        antCost: getRandomInt(antCostRange.min,antCostRange.max), 
        environmentType: environmentType ? environmentType : 'jungle', 
      });

      // Guarda el entorno en la base de datos
      await environmentData.save();

      console.log("🌱🐜🌱🍎🪲🦗 Entorno generado con éxito 🌱🐜🌱🍎🪲🦗");

    }else {
        console.log("El entorno ya existe 🌱🐜🌱🍎🪲🦗");
      }
  } catch (error) {
    console.error("Error al generar el entorno:", error);
  }
}

async function getAntCost(req, res){
  try {
    const antCosts = await Environment.find({}, 'antCost');

    return res.status(200).json(antCosts[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el costo de la hormiga' });
  }
}

async function getUnassignedEnvironment(req, res) {
  try {
    // Encuentra el primer documento que contenga al menos un objeto con assigned=false
    const environmentWithUnassigned = await Environment.findOne({ 'data.assigned': false });

    if (!environmentWithUnassigned) {
      return res.status(404).json({ message: 'No hay objetos sin asignar disponibles.' });
    }

    // Encuentra el primer objeto dentro de 'data' que tiene assigned=false
    const unassignedObject = environmentWithUnassigned.data.find(obj => !obj.assigned);

    // Actualiza el objeto encontrado dentro del documento
    await Environment.updateOne(
      { _id: environmentWithUnassigned._id, 'data._id': unassignedObject._id },
      { $set: { 'data.$.assigned': true } }
    );

    return res.status(200).json({
      _id: unassignedObject._id,
      type: unassignedObject.type,
      name: unassignedObject.name,
      antsRequired: unassignedObject.antsRequired,
      timeRequired: unassignedObject.timeRequired
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener y marcar el objeto como asignado.' });
  }
}

module.exports = { getFullEnvironment, setNewEnvironment, createEnvironment, getAntCost, getUnassignedEnvironment };
