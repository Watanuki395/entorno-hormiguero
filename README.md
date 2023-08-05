# Entorno
## Subsistema de Generación de Entorno

Este subsistema será responsable de generar y modelar el entorno donde se
desarrollará la simulación de la colonia de hormigas. Será responsable de la creación
y mantenimiento de los recursos necesarios para la colonia, como alimentos,
enemigos, y terrenos. El subsistema de Generación de Entorno no estará encargado
de la asignación directa de hormigas, ya que esta función corresponderá a cada
subsistema individual y su interfaz con el módulo de Hormiga Reina. Este subsistema expondrá una
API para la configuración y acceso a los diferentes elementos del entorno

# Entorno API Documentation

Esta documentación describe los endpoints disponibles para gestionar el entorno del proyecto "Hormiguero".

### Base URL

http://localhost/environment 

## Obtener el entorno completo
Endpoint para obtener todos los detalles del entorno actual.

### Endpoint

GET /environment/full 

### Respuesta Exitosa
```json
{ 
"status": 200, 
"environment": { 
"_id": "5f987e5ec5a9c716d37a7790", 
"data": [{
                "_id": "64cebb1b1ebc7401e2ab8dcb",
                "type": "enemy",
                "name": "Araña Venenosa",
                "antsRequired": 9,
                "timeRequired": 5941,
                "defeated": false,
                "assigned": true,
                "__v": 0
            },
            {
                "_id": "64cebb1b1ebc7401e2ab8dca",
                "type": "enemy",
                "name": "Mariposa Monarca",
                "antsRequired": 8,
                "timeRequired": 9866,
                "defeated": false,
                "assigned": false,
                "__v": 0
            },
...], 
"mode": "medium", 
"antCost": 7, 
"environmentType": "jungle" 
} 
} 
```

### Respuesta en Caso de Error
```json
{ 
"status": 404, 
"message": "No se pudo encontrar el entorno." 
} 
```

## Crear un Nuevo Entorno

Endpoint para crear un nuevo entorno con datos aleatorios.

### Endpoint

POST /environment 

### Parámetros del Body
```json
{ 
    "eMode": "easy", 
    "environmentType": "desert"
 } 
```
***NOTA:***
- eMode (opcional): Nivel de dificultad del entorno ("easy", "medium" o "hard").
- environmentType (opcional): Tipo de entorno ("jungle", "desert" u otro).

### Respuesta Exitosa

```json
{ 
"status": 200, 
"message": "Nuevo entorno creado con éxito en modo: easy", 
"environment": { 
"_id": "5f987e5ec5a9c716d37a7790", 
"data": [...], // Array de objetos de alimentos y enemigos 
"mode": "easy", 
"antCost": 5, 
"environmentType": "desert" 
} 
} 
```

### Respuesta en Caso de Error
```json
{ 
"status": 404, 
"message": "Error al crear el entorno." 
} 
```


## Obtener el Costo de la Hormiga

Endpoint para obtener el costo actual de las hormigas en el entorno.

## Endpoint

GET /environment/ant-cost 

### Respuesta Exitosa

```json
{ 
    "_id": "5f987e5ec5a9c716d37a7790", 
    "antCost": 7 
} 
```
### Respuesta en Caso de Error

```json
{ 
    "error": "Error al obtener el costo de la hormiga." 
} 
```

## Obtener Objeto del Entorno

***Endpoint para obtener los elementos del entorno uno por uno, este sera el endpoint que estara disponible para el subsistema de comunicación***

### Endpoint

GET /environment/unassigned 

### Respuesta Exitosa

```json
{ 
    "_id": "5f987e5ec5a9c716d37a77a0", 
    "type": "food", 
    "name": "Apple", 
    "antsRequired": 2, 
    "timeRequired": 3 
} 
```
### Respuesta en Caso de Error

```json
{ 
    "error": "Error al obtener y marcar el objeto como asignado." 
}
```

