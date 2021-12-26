# Coderhouse-Backend
Proyecto para el curso de Desarrollo Backend de Coderhouse en Node.js

## Correr el proyecto
  El proyecto se inicializa corriendo el siguiente script:
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
  
