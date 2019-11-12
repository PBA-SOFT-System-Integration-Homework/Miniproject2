var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: rpc_client.js model");
  process.exit(1);
}

amqp.connect('amqp://mathiasbigler.com:5672', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    channel.assertQueue('', {
      exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      var correlationId = generateUuid();
      var make = args[0];

      console.log(' [x] Requesting make(%s)', make);

      channel.consume(q.queue, function(msg) {
        if (msg.properties.correlationId == correlationId) {
        //   console.log(` [.] Got ${msg.content.toString()}`);
          console.log(msg.content.toString()[0])
          setTimeout(function() { 
            connection.close(); 
            process.exit(0) 
          }, 500);
        }
      }, {
        noAck: true
      });

      channel.sendToQueue('rpc_queue',
        Buffer.from(make.toString()),{ 
          correlationId: correlationId, 
          replyTo: q.queue });
    });
  });
});

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}