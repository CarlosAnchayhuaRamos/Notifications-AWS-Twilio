// const amqp = require('amqplib');

// module.exports.consumer = async (event, context) => {
//   try {
//     //connect to the RabbitMQ service
//     const connection = await amqp.connect('amqps://ugebvzyd:L7D956_Suy5f1849Zl3E4xe1ZK5ylYlJ@beaver.rmq.cloudamqp.com/ugebvzyd');

//     //create a channel
//     const channel = await connection.createChannel();

//     //Declare a queue
//     const queue = 'mail';
//     await channel.assertQueue(queue, {durable: true });

//     //Publicar mensaje en cola
//     await channel.sendToQueue(queue, Buffer.from("Mensaje"), {
//       persistent: true
//     });

//     // //Consume messages from the queue
//     // channel.consume(queue, (message) => {
//     //   console.log('Received message: ${message.content.toString()}');
//     // });
//     return { statusCode: 200, body: 'Consumer started'};
//   } catch(err) {
//     console.log(err);
//     return { statusCode: 500, body: 'Failed to start consumer'};  
//   }
// }

const amqp = require ( 'amqplib/callback_api' );

amqp.connect( 'amqps://ugebvzyd:L7D956_Suy5f1849Zl3E4xe1ZK5ylYlJ@beaver.rmq.cloudamqp.com/ugebvzyd' , function ( error0, connection ) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = 'hello';
    const msg = 'Hello world';

    channel.assertQueue(queue, {
      durable: true
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });
});


