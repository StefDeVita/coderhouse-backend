# Coderhouse-Backend
Proyecto para el curso de Desarrollo Backend de Coderhouse en Node.js


## Server Koa
En esta rama el servidor esta hecho en Koa en lugar de express e implementa las consultas de products con el mismo formato que en express,
es decir, el get post put y delete de productos.

## Correr el proyecto

  Para poder inicializar el proyecto habra que instalar las dependencias de este con el comando
  ```
  npm install
  ```
  Por último el proyecto se inicializa corriendo el siguiente script:
  ```
  npm run start
  ```

  
  

## Información

  En la ruta /info se podra ver la siguiente informacion:
  
  -Argumentos de entrada - Path de ejecución
  
  -Nombre de la plataforma (sistema operativo) - Process id
  
  -Versión de node.js - Carpeta del proyecto
  
  -Memoria total reservada (rss)

## Formato de objetos

  Los objetos (productos) aceptados cuentan con el siguiente formato:
  
  ```
  {
    title: (nombre del producto),
    price: (precio),
    thumbnail: (url al logo o foto del producto)
  }
  ```

## Guardado de los datos

Los datos son guardados en dos bases de datos una de MariaDB y otra de SQLite3, para poder guardar de manera local los datos en la base de MariaDB se debe inicializar MySQL en XAMPP o similares y darle los permisos requeridos.

Los mensajes por otro lado son almacenados en una base de mongoDB cuya uri se debe incluir en un archivo .env con el nombre MONGO_URI.

## Archivo .env
El proyecto toma varios parametros desde el entorno de ejecucion que deberan ser definidos en un archivo .env de la siguiente forma

```
MONGO_URI = "Url a DB mongo"
BCRYPT_ROUNDS = "Rondas de encriptado para la contraseña(numero entero)"
SECRET = "secreto para session"
NODEMAILER_MAIL = "Mail para nodemailer"
NODEMAILER_PASS = "Pass para Nodemailer"
NODEMAILER_HOST = "Host de nodemailer"
NODEMAILER_PORT = "Puerto para nodemailer"
TWILIO_TOKEN = "Token de twilio"
TWILIO_PASS = "Pass de twilio" 
TWILIO_DESTINATION_NUMBER = "numero de whatsapp al que se enviara la confirmacion del pedido formato whatsapp:numero"
STORAGE_MODE = "MONGO o bien SQL dependiendo del tipo de almacenamiento deseado para productos y mensajes"
```

  

