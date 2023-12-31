const mongoose = require("mongoose");
const Enemy = require("../models/Enemy");
const Food = require("../models/Food");
const Environment = require("../models/Environment");
const { createEnemy } = require("./enemyController");
const { createFood } = require("./foodController");
const { getRandomObjectFromArray, getRandomInt, getDificultyRange } = require("../helpers/helpers");


let nextTaskEndpointCalls = 0
let incompleteTaskCount = 0

const getFullEnvironment = async (req, res) => {
  try {
    // Encuentra el entorno activo (isActive: true) 
    const environment = await Environment.findOne({ isActive: true })

    if (!environment) {
      return res.status(404).json({ message: 'Entorno no encontrado.' });
    }

    res.status(200).json({ status: 200, environment });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el entorno.' });
  }
};

async function setNewEnvironment(req, res) {
  try {
    const { eMode, environmentType } = req.body;

    // Crea el entorno primero
    const newEnvironment = await createEnvironment(eMode, environmentType);
    if(!newEnvironment){
      res.json({ status: 200, created: false, message: `No se puede crear un nuevo entorno si ya existe un entorno ACTIVO, por favor desactivar el entorno activo antes de continuar` });
    }else{
      nextTaskEndpointCalls = 0
      res.json({ status: 200, created: true, message: `Nuevo entorno creado con éxito en modo: ${eMode}`, environment: newEnvironment });
    }

  } catch (e) {
    res.json({ status: 404, message: "Error 🐜🐜🐜🐜" });
  }
}


// Controlador para eliminar un entorno por su _id
async function deleteEnvironmentById(req, res) {
  try {
    const { environmentId } = req.body;

    // Verifica si el entorno existe
    const existingEnvironment = await Environment.findById(environmentId);
    if (!existingEnvironment) {
      return res.status(404).json({ message: 'Entorno no encontrado.' });
    }

    // Elimina los enemigos y alimentos relacionados con el entorno
    const environmentData = existingEnvironment.data;
    const relatedEnemiesIds = environmentData.filter(item => item.type === 'enemy').map(item => item._id);
    const relatedFoodsIds = environmentData.filter(item => item.type === 'food').map(item => item._id);

    await Enemy.deleteMany({ _id: { $in: relatedEnemiesIds } });
    await Food.deleteMany({ _id: { $in: relatedFoodsIds } });

    // Elimina el entorno por su _id
    await Environment.findByIdAndDelete(environmentId);
    console.log("Entorno y objetos relacionados eliminados con éxito. 🗑️🐜");

    return res.status(200).json({ message: 'Entorno y objetos relacionados eliminados con éxito.' });
  } catch (error) {
    console.error("Error al eliminar el entorno: ", error);
    return res.status(500).json({ error: 'Error al eliminar el entorno.' });
  }
}


// Función para generar el entorno inicial
async function createEnvironment(eMode, environmentType) {
  try {

     // Verificar si ya existe un entorno activo
     const activeEnvironment = await Environment.findOne({ isActive: true });

     if (!activeEnvironment) {
      // Desactivar todos los entornos anteriores
      await Environment.updateMany({}, { isActive: false });

      // Crea el entorno utilizando el modelo Environment
      let antCostRange = getDificultyRange(eMode);
      
      const environmentData = new Environment({
        mode: eMode ? eMode : 'medium',
        antCost: getRandomInt(antCostRange.min,antCostRange.max), 
        environmentType: environmentType ? environmentType : 'jungle',
        isActive: true
      });

      // Guarda el entorno en la base de datos
      const savedEnvironment = await environmentData.save();

      console.log("🌱🐜🌱🍎🪲🦗 Entorno generado con éxito 🌱🐜🌱🍎🪲🦗");


      // Crea objetos de comida y enemigos usando el _id del entorno
      const allEnemies = await createFood(eMode, savedEnvironment._id)
      const allFoods = await createEnemy(eMode, savedEnvironment._id)

      // Crear un solo array con todos los datos de alimentos y enemigos
      const allData = [...allEnemies, ...allFoods];

      // Crear un array aleatorio mezclado de objetos de alimentos y enemigos
      const mixedData = [];
      while (allData.length > 0) {
        const randomIndex = getRandomObjectFromArray(allData);
        mixedData.push(allData[randomIndex]);
        allData.splice(randomIndex, 1);
      }

      // Actualiza el entorno con los IDs de los objetos de comida y enemigos
      const result = await Environment.findByIdAndUpdate(savedEnvironment._id, {
        data: mixedData
      }, { new: true });

      console.log("🌱🐜🌱🍎🪲🦗 Entorno actualizado con objetos de comida y enemigos 🌱🐜🌱🍎🪲🦗");

      return result; // Retorna el entorno guardado con relaciones

     }else {
      console.log("🌱🐜🌱🍎🪲🦗 Ya existe un entorno activo 🌱🐜🌱🍎🪲🦗");
      return false
     }
    
  } catch (error) {
    console.error("Error al generar el entorno:", error);
  }
}


async function getAntCost(req, res){
  try {
    // Encuentra el entorno activo (isActive: true) y obtén su antCost
    const activeEnvironment = await Environment.findOne({ isActive: true }, 'antCost');

    if (!activeEnvironment) {
      return res.status(404).json({ message: 'Entorno activo no encontrado.' });
    }

    return res.status(200).json(activeEnvironment);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el costo de la hormiga' });
  }
}

async function getUnassignedEnvironment(req, res) {
  try {
    // Encuentra el primer documento que contenga al menos un objeto con assigned=false
    const environmentWithUnassigned = await Environment.findOne({
      isActive: true,
      "data.assigned": false,
    });

    if (!environmentWithUnassigned) {
      const incompleteTask = await Environment.findOne({
        isActive: true,
        "data.completed": false,
      });

      if (!incompleteTask) {
        // Buscar el último entorno activo
        const lastActiveEnvironment = await Environment.findOne({
          isActive: true,
        })
          .sort({ createdAt: -1 }) // Ordenar por fecha de creación en orden descendente
          .exec();

        if (lastActiveEnvironment) {
          // Desactivar el entorno activo
          lastActiveEnvironment.isActive = false;
          await lastActiveEnvironment.save();
        }

        // Creamos un entorno nuevo
        createEnvironment();
        return res.status(404).json({
          message:
            "No quedan enemigos ni comidas en este entorno, todas las tareas finalizaron con exito, se creara un nuevo entorno",
          envState: "completed",
        });
      }

      ///*En caso de que se asignen los objetos del entorno pero no se completen */
      const incompleteTasks = incompleteTask.data.filter(
        (item) => !item.completed
      );

      if (nextTaskEndpointCalls === 0) {
        nextTaskEndpointCalls++;
        incompleteTaskCount = incompleteTasks.length;
        return res.status(404).json({
          message:
            `No quedan enemigos ni comidas por asignar, pero hay ${incompleteTasks.length} de las tareas asignadas que no se han completado. El entorno se desactivara si ninguna las tareas no se completan antes de la proxima llamada de comunicacion`,
        });
      }

      /* En caso de que sea la segunda llamada de comunicacion y ningun objeto se completara */
      if (
        nextTaskEndpointCalls > 0 &&
        incompleteTasks.length === incompleteTaskCount
      ) {
        // Buscar el último entorno activo
        const lastActiveEnvironment = await Environment.findOne({
          isActive: true,
        })
          .sort({ createdAt: -1 }) // Ordenar por fecha de creación en orden descendente
          .exec();

        if (lastActiveEnvironment) {
          // Desactivar el entorno activo
          lastActiveEnvironment.isActive = false;
          await lastActiveEnvironment.save();
        }

        // Creamos un entorno nuevo
        createEnvironment();
        nextTaskEndpointCalls = 0

        return res.status(404).json({
          message:
            "No se completo ninguna tarea desde la ultima revision, se procede a desactivar el entorno",
        });

      }else if(
        nextTaskEndpointCalls > 0 &&
        incompleteTasks.length < incompleteTaskCount){
          return res.status(404).json({
            message:
              `No quedan enemigos ni comidas por asignar, pero todavia quedan ${incompleteTasks.length} de las tareas asignadas que no se han completado. El entorno se desactivara si ninguna las tareas no se completan antes de la proxima llamada de comunicacion`,
          });
        }

        ///just in case
      return null;
    }

    // Encuentra el primer objeto dentro de 'data' que tiene assigned=false
    const unassignedObject = environmentWithUnassigned.data.find(
      (obj) => !obj.assigned
    );

    // Actualiza el objeto encontrado dentro del documento
    await Environment.updateOne(
      { _id: environmentWithUnassigned._id, "data._id": unassignedObject._id },
      { $set: { "data.$.assigned": true } }
    );

    let result = {};
    if (unassignedObject.type === "food") {
      result = await Food.findByIdAndUpdate(
        unassignedObject._id,
        { $set: { assigned: true } },
        { new: true }
      );
    } else if (unassignedObject.type === "enemy") {
      result = await Enemy.findByIdAndUpdate(
        unassignedObject._id,
        { $set: { assigned: true } },
        { new: true }
      );
    }

    let resultUpdated = {};
    if (result.type === "food") {
      resultUpdated = {
        _id: result._id,
        type: result.type,
        name: result.name,
        antsRequired: result.antsRequired,
        timeRequired: result.timeRequired,
        foodValue: result.foodValue,
      };
    } else if (result.type === "enemy") {
      resultUpdated = {
        _id: result._id,
        type: result.type,
        name: result.name,
        antsRequired: result.antsRequired,
        timeRequired: result.timeRequired,
      };
    }

    req.io.emit("update", { message: resultUpdated });
    return res.status(200).json(resultUpdated);
  } catch (error) {
    return res.status(500).json({
      error: "Error al obtener y marcar el objeto como asignado. " + error,
    });
  }
}

async function updateAssignedObjects(req, res) {
  try {
    const { assignedObjectId } = req.body;

    // Encuentra el entorno activo
    const activeEnvironment = await Environment.findOne({ isActive: true });

    if (!activeEnvironment) {
      return res.status(404).json({ message: 'No hay entornos activos disponibles.' });
    }

    // Encuentra el objeto dentro de 'data' por su _id
    const targetObject = activeEnvironment.data.find(obj => obj._id.toString() === assignedObjectId);

    if (!targetObject) {
      return res.status(404).json({ message: 'Objeto no encontrado en el entorno activo.' });
    }

    if (!targetObject.assigned) {
      return res.status(400).json({ message: 'El objeto no está asignado.' });
    }

    if (targetObject.completed) {
      return res.status(400).json({ message: 'El objeto ya ha sido completado.' });
    }

    // Actualiza el objeto encontrado dentro del documento del entorno activo
    await Environment.updateOne(
      { _id: activeEnvironment._id, 'data._id': targetObject._id },
      { $set: { 'data.$.completed': true } }
    );

    let result = {}
    if (targetObject.type === 'food') {
      // Actualiza el objeto de comida (Food) si es necesario
      result = await Food.findByIdAndUpdate(
        targetObject._id,
        { $set: { completed: true } },
        { new: true }
      );
    } else if (targetObject.type === 'enemy') {
      // Actualiza el objeto de enemigo (Enemy) si es necesario
      result = await Enemy.findByIdAndUpdate(
        targetObject._id,
        { $set: { completed: true } },
        { new: true }
      );
    }

    let resultUpdated = { 
      _id: result._id,
      type: result.type,
      name: result.name,
      state: result.type === 'food' ? 'collected' : 'defeated'
    };
    req.io.emit('update', { message: resultUpdated });
    return res.status(200).json(resultUpdated);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener y marcar el objeto como asignado. ' + error });
  }
}

async function deactivateLastActiveEnvironment(req, res) {
  try {
    // Buscar el último entorno activo
    const lastActiveEnvironment = await Environment.findOne({ isActive: true })
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación en orden descendente
      .exec();

    if (lastActiveEnvironment) {
      // Desactivar el entorno activo
      lastActiveEnvironment.isActive = false;
      await lastActiveEnvironment.save();

      return res.status(200).json({ message: 'Último entorno activo desactivado con éxito' });
    } else {
      return res.status(404).json({ message: 'No se encontró ningún entorno activo' });
    }
  } catch (error) {
    console.error('Error al desactivar el último entorno activo:', error);
    return res.status(500).json({ message: 'Error al desactivar el último entorno activo' });
  }
}

module.exports = { getFullEnvironment, setNewEnvironment, createEnvironment, getAntCost, getUnassignedEnvironment, updateAssignedObjects, deleteEnvironmentById, deactivateLastActiveEnvironment };
