var amqp = require('amqplib/callback_api');
var fs = require('fs')

convertTxtContentToArray = (data) => {
    var txtData = data.toString().split('\n').map(function (el) { return el.replace("\r", "").split(",");}); 
    var headings = txtData.shift(); // removes and returns the headings of the cars ['id,make,model,year,vin_number']

    return txtData.map(function (el) {
        var obj = {};
        for (var i = 0; i < el.length; i++) {
            obj[headings[i]] = el[i]
        }
        return obj;
    });
}

readCarsFromSources = () => {
    var txtContent = fs.readFileSync('cars.txt', 'utf8') 
    var txtSource = convertTxtContentToArray(txtContent)
    var jsonSource = JSON.parse(fs.readFileSync('cars.json', 'utf8'))
    return jsonSource.concat(txtSource)
}

amqp.connect('amqp://mathiasbigler.com:5672', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'rpc_queue';

    channel.assertQueue(queue, {
      durable: false
    });
    channel.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, function reply(msg) {
      var make = msg.content.toString()

      console.log(" [.] make(%s)", make);

      var data = readCarsFromSources()
      filteredData = data.filter(element => element["make"] == make)

      channel.sendToQueue(msg.properties.replyTo,
        Buffer.from(filteredData.toString()), {
          correlationId: msg.properties.correlationId
        });

      channel.ack(msg);
    });
  });
});

function fibonacci(n) {
  if (n == 0 || n == 1)
    return n;
  else
    return fibonacci(n - 1) + fibonacci(n - 2);
}