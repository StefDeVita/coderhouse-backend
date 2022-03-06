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
  
## Login y registro

  El sitio tiene implementado un sistema de login y registro que se almacena en una base de datos en la nube. Al registrarse sin ningún error y luego logearse
  en la página principal se mantendrá una sesión durante 10 minutos o hasta deslogearse con el botón correspondiente.


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
    author: {
        id: 'mail del usuario', 
        nombre: 'nombre del usuario', 
        apellido: 'apellido del usuario', 
        edad: 'edad del usuario', 
        alias: 'alias del usuario',
        avatar: 'url avatar (foto, logo) del usuario'
    },
    text: 'mensaje del usuario'
  }
  Ademas se le añade un atributo date en author al momento de guardarse

  ```
## Guardado de los datos

Los datos son guardados en dos bases de datos una de MariaDB y otra de SQLite3, para poder guardar de manera local los datos en la base de MariaDB se debe inicializar MySQL en XAMPP o similares y darle los permisos requeridos.

Los mensajes por otro lado son almacenados en una base de mongoDB cuya uri se debe incluir en un archivo .env con el nombre MONGO_URI.


