# Coderhouse-Backend
Proyecto para el curso de Desarrollo Backend de Coderhouse en Node.js

## Correr el proyecto
  Antes de inicializar el proyecto habra que moverse al directorio correspondiente al motor de plantillas deseado ya sea con el explorador de archivos o un comando de tipo
  ```
  cd handlebars
  ```
  Luego de esto habra que instalar las dependencias de ese proyecto con el comando
  ```
  npm install
  ```
  Por último el proyecto se inicializa corriendo el siguiente script:
  ```
  npm start
  ```
## Peticiones al server

  En esta rama se pueden hacer las siguientes peticiones
  ```
  GET '/productos' -> devuelve todos los productos.
  POST '/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
  

  ```
## Muestra de objetos
  Los objetos agregados se muestran en una tabla a la cual se puede acceder desde la pagina principal mediante un boton
## Formato de objetos
  Los objetos aceptados cuentan con el siguiente formato:
  
  ```
  {
    title: (nombre del producto),
    price: (precio),
    thumbnail: (url al logo o foto del producto)
  }

  ```
  
