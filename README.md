# Entorno
## Subsistema de Generación de Entorno

Este subsistema será responsable de generar y modelar el entorno donde se
desarrollará la simulación de la colonia de hormigas. Será responsable de la creación
y mantenimiento de los recursos necesarios para la colonia, como alimentos,
enemigos, y terrenos. El subsistema de Generación de Entorno no estará encargado
de la asignación directa de hormigas, ya que esta función corresponderá a cada
subsistema individual y su interfaz con el módulo de Hormiga Reina. Este subsistema expondrá una
API para la configuración y acceso a los diferentes elementos del entorno
