const amqp = require('amqplib/callback_api');

const io = require('socket.io')(process.env.PORT || 4000, {
  cors: {
    origin: '*',
  },
});
amqp.connect('amqp://localhost', (err0, connection) => {
  if (err0) {
    throw err0;
  }
  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }

    io.on('connection', (socket) => {
      if (socket.handshake.query.session == 'send') {
        const QUEUE_1 = process.env.QUEUE_1 || 'PUSH';
        channel.assertQueue(QUEUE_1);
        socket.on('PUBLISH', (message) => {
          channel.sendToQueue(QUEUE_1, Buffer.from(message));
          io.to(socket.id).emit('SUBSCRIBE', `Sent: ${message}`);
        });
      } else if (socket.handshake.query.session == 'receive') {
        const QUEUE_2 = process.env.QUEUE_2 || 'PULL';
        channel.assertQueue(QUEUE_2);
        channel.consume(
          QUEUE_2,
          (message) => {
            const text = message.content.toString();
            io.to(socket.id).emit('SUBSCRIBE', `Received: ${text}`);
          },
          { noAck: true },
        );
      }
    });
  });
});
