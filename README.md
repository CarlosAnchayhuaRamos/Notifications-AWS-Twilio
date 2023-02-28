# Massive uploader - Laravel Package

## Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```


## Instalación

_Below is an example of how installing and setting up the app._

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter your credentials in .env`
   ```
   TWILIO_ACCOUNT_SID=Your SID
   TWILIO_AUTH_TOKEN=Your AUTH TOKEN;

   SENDGRID_API_KEY=YOUR API KEY
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Uso

### Archivo de configuración

Para la implemetación del aplicativo es necesario un archivo de configuración:

```sh
    touch config/.env.dev
``` 
Note: Replace the value __.env.dev__ with appropriate ones before running the application


### Configuración del proyecto

```
    ## DATABASE
    DATABASE_HOST=YOURDATABASEHOST
    DATABASE_USER=YOURDATABASEUSER
    DATABASE_PASSWORD=YOURDATABASEPASSWORD
    DB_NOTIFICATION=YOURDATABASENAME
    CHARGE_TABLE=demo-poc-charge-service-dev
    DB_NAME=YOURDATABASECOLLECTION
    DB_BOOKS_COLLECTION=notifications-send
    DB_NOTIFICATIONS_COLLECTION=notifications-send

    ## SQS
    SQS_ACCOUNT=YOURSQSACCOUNT
    SQS_MAIL_NAME=notification-mail
    SQS_WHATSAPP_NAME=notification-whatsapp
    SQS_SMS_NAME=notification-sms
    SQS_PUSH_NAME=notification-push

    ## TWILO
    TWILIO_ACCOUNT_SID=YOURTWILIOSID
    TWILIO_AUTH_TOKEN=YOURTWILIOTOKEN

    ## SENDGRID
    SENDGRID_API_KEY=YOURSENDGRIDKEY
```

__Architecture:__ Tipo de arquitectura que sigue el proyecto es:

   - microservices 

__Microservices:__ Se deben colocar las URLS de los microservicios que componen el proyecto. Solo es necesario llenarlo si la arquitectura de la aplicación es de tipo
`microservices`, caso contrario se puede dejar esta opción vacía.

    - POST - http://localhost:3000/dev/receipt
    - POST - http://localhost:3000/dev/sendmail
    - POST - http://localhost:3000/dev/sendwhatsapp
    - POST - http://localhost:3000/dev/sendsms
    - POST - http://localhost:3000/dev/schedul

_Nota_: Para que el paquete funcione correctamente debe ejecutar __npm run local__ y para deployar debe ejecutar __npm run deploy__.


### Configuración de funcionalidades

En el archivo app/utils/constants.ts se encuentran los parametros.

```
    export const TIME_SEND_SCHEDULE = 5;
    export const MAX_ATTEMPTS = 5
``` 

__TIME_SEND_SCHEDULE:__ Es el periodo de ejecución de la función schedul. Esta función se encarga de enviar las notificaciones programadas.

__MAX_ATTEMPTS:__ Máximo numero de intentos del envío de notificación.


### Configuración de entidades

```
    {
      "_id": {
        "$oid": ""
      },
      "channel": "",
      "type": "",
      "send": {
        "scheduling": ,
        "date": ""
        }
      },
      "data": {
        "title": "",
        "body": "",
        "from": "",
        "to": [
          {
            "_id": {
              "$oid": ""
            },
            "to": "",
            "metadata": {
              "name": "",
              "last_name": "",
              "work": ""
            }
          }
        ],
        "image": ""
      },
      "status": "",
      "attempts": ,
      "createdAt": {
        "$date": ""
      },
      "updatedAt": {
        "$date": ""
      },
      "__v": 0
    }
``` 

___id:__ Identificador único del objeto generado por MongoDB, en formato de objeto BSON.

__channel:__ Canal de comunicación utilizado para enviar el mensaje, puede ser "EMAIL", "WHATSAPP", "SMS", "PUSH".

__type:__ Tipo de mensaje, en este caso "SINGLE" que significa un mensajes personalisados o "COMPOUND" para enviar un mismo mensaje a todos los remitentes.

__send:__ Objeto que describe si el mensaje fue programado para un envío futuro y la fecha de envío programada. En este caso, si "scheduling" es true, significa que el mensaje fue programado, y "date" es un objeto que representa una fecha y hora en formato de fecha BSON.

__data:__ Contiene el contenido del mensaje. "title" es el título del mensaje, "body" es el cuerpo del mensaje que incluye variables como $name, $last_name y $work que serán remplazados por los valores correspondientes en la lista de destinatarios. "from" es la dirección de correo electrónico del remitente, "to" es una lista de destinatarios, donde cada objeto contiene una dirección de correo electrónico, un ID generado por MongoDB para ese destinatario en particular, y metadatos adicionales sobre ese destinatario como su nombre y apellido y el nombre de su empresa. "image" contiene una referencia a una imagen relacionada para los mensajes de tipo push.

__status:__ Estado del mensaje, "SENT" que significa que el mensaje ha sido enviado, "PENDING" que está pendiente de enviar y "SENT_ERROR" para mensajes que no puedieron ser enviados.

__attempts:__ Número de intentos que se han hecho para enviar el mensaje.

__createdAt:__ Fecha de creación del objeto en formato BSON.

__updatedAt:__ Fecha de actualización del objeto en formato BSON.
