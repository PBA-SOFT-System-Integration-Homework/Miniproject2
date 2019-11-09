var q = 'tasks';
 
function bail(err) {
  console.error(err);
  process.exit(1);
}
 
// Publisher
function publisher(conn) {
  conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(q);
    let msg = 'something to do'
    console.log('msg: ' + msg)
    ch.sendToQueue(q, Buffer.from(msg));
  }
}
 
require('amqplib/callback_api')
  .connect('amqp://mathiasbigler.com:5672', function(err, conn) {
    if (err != null) bail(err);
    publisher(conn);
  });