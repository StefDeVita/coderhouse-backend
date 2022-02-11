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
  DELETE: '/:idCarrito' - Elimina un carrito.
  GET: '/:idCarrito/products' - Me permite listar todos los productos guardados en el carrito
  POST: '/:idCarrito/products/:id_prod' - Para incorporar productos al carrito indicando el ID del carrito y del producto 
  DELETE: '/:idCarrito/products/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto

  ```
  En caso de ser exitosas las peticiones devolveran un objeto con un status 200 de éxito y el payload que corresponda (el producto o carrito indicado).  
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
  Estos se crearan y se devolveran con el arreglo de productos vacio ademas de su id de carrito y timestamp correspondiente

  ## Almacenamiento de los objetos

  Se decidira en base a una variable de entorno llamada STORAGE_MODE el tipo de almacenamiento pudiendo elegir entre MONGO(mongodb),FIRE(firestore) y FILES(filesystem).Dependiendo de esta variable se crearan los contenedores correspondientes.
