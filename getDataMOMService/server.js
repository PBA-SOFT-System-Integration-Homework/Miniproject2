var amqp = require('amqplib/callback_api');
const fetch = require('node-fetch');

amqp.connect('amqp://mathiasbigler.com:5672', function (error, connection) {
    connection.createChannel(function (error, channel) {
        const queue = 'car_list_request';

        channel.assertQueue(queue, {
            durable: true
        });

        channel.prefetch(1);

        channel.consume(queue, async function (msg) {
            const filter = JSON.parse(msg.content.toString());
            const replyTo = msg.properties.replyTo;

            let carList = [];
            await fetch('http://localhost:3001/car')
                .then(res => res.json())
                .then(res => {
                    carList = res
                })
            await fetch('http://localhost:3002/car')
                .then(res => res.text())
                .then(text => {
                    const formattedList = convertTxtContentToArray(text);

                    console.log(formattedList);
                    carList = carList.concat(formattedList);
                })
            carList = carList.filter(c => c.make === filter.make && c.year >= filter.year);
            channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(carList)));
            channel.ack(msg)
        }, {
            noAck: false
        });
    });
});

function convertTxtContentToArray(data) {
    const txtData = data.toString().split('\n').map(function (el) { return el.replace("\r", "").split(","); });
    const headings = txtData.shift(); // removes and returns the headings of the cars ['id,make,model,year,vin_number']

    return txtData.map(function (el) {
        const obj = {};
        for (var i = 0; i < el.length; i++) {
            obj[headings[i]] = el[i]
        }
        return obj;
    });
}