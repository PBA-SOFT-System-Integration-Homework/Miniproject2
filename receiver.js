var q = 'tasks';

// Consumer
function consumer(conn) {
    var ok = conn.createChannel(on_open);
    function on_open(err, ch) {
      if (err != null) bail(err);
      ch.assertQueue(q);
      ch.consume(q, function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
          ch.ack(msg);
        }
      });
    }
  }
   
  require('amqplib/callback_api')
    .connect('amqp://mathiasbigler.com:5672', function(err, conn) {
      if (err != null) bail(err);
      consumer(conn);
    });