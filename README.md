# Coderhouse-Backend
Proyecto para el curso de Desarrollo Backend de Coderhouse en Node.js

## Correr el proyecto
  Primero se deben instalar todas las dependencias con el comando
  ```
  npm install
  ```
  Luego el proyecto se inicializa corriendo el siguiente script:
  ```
  npm run start
  ```
## Peticiones al server

  Actualmente se pueden hacer las siguientes peticiones para productos
  ```
  GET '/api/products' -> devuelve todos los productos.
  GET '/api/products/:id' -> devuelve un producto según su id.
  POST '/api/products' -> recibe y agrega un producto, y lo devuelve con su id asignado.
  PUT '/api/products/:id' -> recibe y actualiza un producto según su id.
  DELETE '/api/products/:id' -> elimina un producto según su id.

  ```

  A su vez se pueden hacer las siguientes peticiones para los carritos
  ```
  POST: '/' - Crea un carrito y lo devuelve.
  DELETE: '/:id' - Elimina un carrito.
  GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
  POST: '/:id/productos/:id_prod' - Para incorporar productos al carrito por su id de producto
  DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto

  ```
## Formato de objetos
  Los productos aceptados cuentan con el siguiente formato:
  
  ```
  {
    title: (nombre del producto),
    price: (precio),
    thumbnail: (url al logo o foto del producto),
    description: (descripcion del producto),
    stock: (stock del producto),
    code: (codigo del producto)
  }

  ```
  Ademas se le agregara un ID y un timestamp a cada producto asi como a cada carrito al crearse.

  El formato de los carritos es
  ```
  {
    products: [Arreglo con los productos agregados],
    _id: (id del carrito),
    timestamp: (timestamp del carrito),
  }

  ```
  Estos se crearar y se devolveran con el arreglo vacio ademas de su id y timestamp correspondiente
