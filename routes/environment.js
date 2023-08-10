const express = require('express')
const router = express.Router()
// const checkOrigin = require('../middleware/origin')
//const checkAuth = require('../middleware/auth')
// const checkRoleAuth = require('../middleware/roleAuth')
const { getFullEnvironment, getAntCost, getUnassignedEnvironment, setNewEnvironment, updateAssignedObjects, deleteEnvironmentById } = require('../controllers/environmentController')

/**
 * @swagger
 * components:
 *   schemas:
 *     # Esquema para el objeto de comida (Food)
 *     Food:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         type:
 *           type: string
 *         name:
 *           type: string
 *         antsRequired:
 *           type: number
 *         timeRequired:
 *           type: number
 *         foodValue:
 *           type: number
 *         completed:
 *           type: boolean
 *         assigned:
 *           type: boolean
 *
 *     # Esquema para el objeto de enemigo (Enemy)
 *     Enemy:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         type:
 *           type: string
 *         name:
 *           type: string
 *         antsRequired:
 *           type: number
 *         timeRequired:
 *           type: number
 *         completed:
 *           type: boolean
 *         assigned:
 *           type: boolean
 *      # Esquema para el objeto de entorno (Environment)
 *     Environment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               type:
 *                 type: string
 *               name:
 *                 type: string
 *               antsRequired:
 *                 type: number
 *               timeRequired:
 *                 type: number
 *               foodValue:
 *                 type: number
 *               completed:
 *                 type: boolean
 *               assigned:
 *                 type: boolean
 *         mode:
 *           type: string
 *         antCost:
 *           type: number
 *         environmentType:
 *           type: string
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */



/**
 * @swagger
 * tags:
 *  name: Entorno
 *  description: Creación del Entorno
 */

/**
 * @swagger
 * tags:
 *  name: Proyecto
 *  description: Necesarios para interactuar con otros subsistemas
 */

/**
 * @swagger
 * /api/environment/full:
 *   get:
 *     summary: Obtener toda la información el ultimo entorno activo
 *     tags: [Entorno]
 *     responses:
 *       200:
 *         description: OK. Retorna el entorno completo con objetos relacionados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Environment'
 *       404:
 *         description: Entorno no encontrado
 *       500:
 *         description: Error al obtener el entorno.
 */

router.get('/full', getFullEnvironment )

/**
 * @swagger
 * /api/environment/next-task:
 *   get:
 *     summary: Obtener el siguiente objeto no asignado del entorno activo
 *     tags: [Proyecto]
 *     responses:
 *       200:
 *         description: OK. Retorna el siguiente objeto no asignado.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Food'
 *                 - $ref: '#/components/schemas/Enemy'
 *       404:
 *         description: No hay objetos no asignados disponibles o no se encuentra un entorno activo.
 *       500:
 *         description: Error al obtener el objeto no asignado.
 */

router.get('/next-task', getUnassignedEnvironment )

/**
 * @swagger
 * /api/environment/ant-cost:
 *   get:
 *     summary: Obtener el costo de la hormiga en el entorno activo
 *     tags: [Proyecto]
 *     responses:
 *       200:
 *         description: OK. Retorna el costo de la hormiga.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del entorno.
 *                   example: 64d4641f83dd3ba1ee4cc51c
 *                 antCost:
 *                   type: number
 *                   description: Costo de la hormiga en el entorno.
 *                   example: 5
 *       500:
 *         description: Error al obtener el costo de la hormiga
 */

router.get('/ant-cost', getAntCost )

/**
 * @swagger
 * /api/environment/update-task:
 *   patch:
 *     summary: Marcar un objeto asignado como completado en el entorno activo
 *     tags: [Proyecto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignedObjectId:
 *                 type: string
 *                 description: ID del objeto asignado.
 *                 example: 64d4642083dd3ba1ee4cc532
 *     responses:
 *       200:
 *         description: OK. Retorna el objeto actualizado con estado completado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del objeto.
 *                   example: 64d4642083dd3ba1ee4cc532
 *                 type:
 *                   type: string
 *                   description: Tipo del objeto (food o enemy).
 *                   example: food
 *                 name:
 *                   type: string
 *                   description: Nombre del objeto.
 *                   example: Manzana
 *                 state:
 *                   type: string
 *                   description: Estado del objeto (collected o defeated).
 *                   example: collected
 *       400:
 *         description: El objeto ya ha sido completado o no se encuentra en el entorno activo.
 *       404:
 *         description: No hay objetos asignados disponibles o no se encuentra un entorno activo.
 *       500:
 *         description: Error al marcar el objeto como completado.
 */

router.patch('/update-task', updateAssignedObjects);

/**
 * @swagger
 * /api/environment/new:
 *   post:
 *     summary: Crear un nuevo entorno
 *     tags: [Entorno]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eMode:
 *                 type: string
 *                 description: Modo del entorno.
 *                 example: hard
 *               environmentType:
 *                 type: string
 *                 description: Tipo de entorno.
 *                 example: desert
 *     responses:
 *       200:
 *         description: OK. Retorna el nuevo entorno creado con objetos relacionados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Environment'
 *       404:
 *         description: Error al crear el entorno.
 *       500:
 *         description: Error al crear el entorno.
 */

router.post('/new', setNewEnvironment )

/**
 * @swagger
 * /api/environment/destroy:
 *   delete:
 *     summary: Eliminar un entorno por su ID
 *     tags: [Entorno]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               environmentId:
 *                 type: string
 *                 description: ID del entorno a eliminar.
 *                 example: 64d4642083dd3ba1ee4cc532
 *         description: ID del entorno a eliminar
 *     responses:
 *       200:
 *         description: OK. Entorno eliminado con éxito.
 *       404:
 *         description: Entorno no encontrado
 *       500:
 *         description: Error al eliminar el entorno.
 */

router.delete('/destroy', deleteEnvironmentById )





module.exports = router