const Food = require("../models/Food");
const { getRandomInt, getDificultyRange } = require("../helpers/helpers");

// Función para borrar todos los enemigos existentes de la base de datos
async function deleteExistingFoods() {
  try {
    await Food.deleteMany({});
    console.log("Datos de alimentos existentes eliminados con éxito. 🗑️🍎");
  } catch (error) {
    console.error("Error al eliminar datos de alimentos existentes:", error);
  }
}

const createFood = async (eMode, environmentId) => {
  try {
      const foodData = generateFoods(eMode, environmentId);
      const createdFoods = await Food.insertMany(foodData);
      console.log("Datos de alimentos insertados con éxito. 🍎");
      return createdFoods;
  } catch (error) {
    console.error("Error al insertar los datos de alimentos:", error);
  }
};

function generateFoods(eMode, environmentId) {
  let antsRequired = getDificultyRange(eMode);
  const foodsData = antFoods.map((food) => ({
    type: food.type,
    name: food.name,
    details: food.details,
    foodValue: getRandomInt(2, 8), 
    antsRequired: getRandomInt(antsRequired.min, antsRequired.max),
    timeRequired: getRandomInt(5000, 25000),
    completed: false,
    assigned: false,
    enviroment: environmentId
  }));

  return foodsData;
}

const antFoods = [
  {
    type: "food",
    name: "Migas de Pan",
    details:
      "¡El manjar de las hormigas gourmet! Pequeñas piezas de pan crujiente que mantienen a tus hormigas felices y llenas de energía durante todo el día.",
  },
  {
    type: "food",
    name: "Fruta Picada",
    details:
      "Deliciosas frutas cortadas en porciones hormiga-amigables. ¡Mmm, alguien perdio parte de su desayuno!",
  },
  {
    type: "food",
    name: "Aguacate Maduro",
    details:
      "¡La hormiga millennial no puede resistirse a este manjar de moda! Un aguacate maduro perfectamente cortado, lleno de grasas saludables para una hormiga llena de vitalidad.",
  },
  {
    type: "food",
    name: "Caramelo Duro",
    details:
      "El combustible que mantiene a nuestras obreras siempre en movimiento. ¡Una cucharadita de azúcar granulada es todo lo que necesitan para construir su imperio!",
  },
  {
    type: "food",
    name: "Hojas Verdes",
    details:
      "El plato preferido de las hormigas vegetarianas. Hojas frescas y crujientes que les dan un impulso de energía para excavar, recolectar y construir.",
  },
  {
    type: "food",
    name: "Semillas de Girasol",
    details:
      "¡Una fuente de energía que brilla como el sol! Estas pequeñas semillas son un bocadillo perfecto para nuestras trabajadoras incansables.",
  },
  {
    type: "food",
    name: "Uvas",
    details:
      "Uvas jugosas y deliciosas para endulzar el día de nuestras laboriosas hormigas. ¡Dulce y refrescante!",
  },
  {
    type: "food",
    name: "Rodajas de Zanahoria",
    details:
      "El secreto para tener una visión aguda y construir una colonia fuerte. ¡Zanahorias coloridas y crujientes para nuestras hormigas ingenieras!",
  },
  {
    type: "food",
    name: "Pepino en Cubos",
    details:
      "Un refrigerio refrescante y lleno de hidratación para nuestras obreras que trabajan bajo el sol. ¡Crocante y fresco!",
  },
  {
    type: "food",
    name: "Goma de Mascar",
    details:
      "¡El chicle de las hormigas! Un gustito dulce y duradero que les ayuda a liberar el estrés y mantener su trabajo en equipo.",
  },
];

module.exports = { createFood };
