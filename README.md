# Coderhouse-Backend
Proyecto para el curso de Desarrollo Backend de Coderhouse en Node.js

## Correr el proyecto

  Para poder inicializar el proyecto habra que instalar las dependencias de este con el comando
  ```
  npm install
  ```
  Por último el proyecto se inicializa corriendo el siguiente script:
  ```
  npm run start
  ```
## Muestra de objetos
  Los objetos agregados se muestran en una tabla en la página principal que se actualiza en vivo sin necesidad de recargar la misma para todos los clientes.
  Por otro lado los mensajes se muestran debajo de esta tabla de la misma forma. La página cuenta con dos formularios, uno para cada funcionalidad.
## Formato de objetos
  Los objetos (productos) aceptados cuentan con el siguiente formato:
  
  ```
  {
    title: (nombre del producto),
    price: (precio),
    thumbnail: (url al logo o foto del producto)
  }

  ```
  Por otro lado los mensajes aceptados cuentan con el siguiente formato
  ```
  {
    author: (email del autor),
    text: (texto del mensaje),
    date: (fecha del mensaje formateada para mostrarse en la página)
  }

  ```
## Guardado de los datos

Los datos (tanto los productos como los mensajes) son guardados en dos bases de datos una de MariaDB y otra de SQLite3, para poder guardar de manera local los datos en la base de MariaDB se debe inicializar MySQL en XAMPP o similares y darle los permisos requeridos. La base de SQLite se guardara en un archivo en el directorio db/messages.sqlite.
