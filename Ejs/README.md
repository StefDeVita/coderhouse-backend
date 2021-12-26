# Coderhouse-Backend
Proyecto para el curso de Desarrollo Backend de Coderhouse en Node.js

## Correr el proyecto
  El proyecto se inicializa corriendo el siguiente script:
  ```
  npm start
  ```
## Peticiones al server

  Actualmente se pueden hacer las siguientes peticiones
  ```
  GET '/api/productos' -> devuelve todos los productos.
  GET '/api/productos/:id' -> devuelve un producto según su id.
  POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
  PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
  DELETE '/api/productos/:id' -> elimina un producto según su id.

  ```
## Formato de objetos
  Los objetos aceptados cuentan con el siguiente formato:
  
  ```
  {
    title: (nombre del producto),
    price: (precio),
    thumbnail: (url al logo o foto del producto)
  }

  ```
  
