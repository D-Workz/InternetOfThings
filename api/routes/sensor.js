var express = require('express');
var router = express.Router();
var kafka = require('kafka-node');



/* GET users listing. */
router.post('/', function(req, res, next) {
    // const
    var kafka = require('kafka-node'),
        Producer = kafka.Producer,
        KeyedMessage = kafka.KeyedMessage,
        client = new kafka.KafkaClient({kafkaHost: '92.42.47.172:9092'}),
        producer = new Producer(client),
        km = new KeyedMessage('key', 'message'),
        payloads = [
            { topic: 'testc', messages: 'hi', partition: 0 },
            { topic: 'testc', messages: ['hello', 'world', km] }
        ];


    producer.on('ready', function () {
            console.log("jo");
    });

    producer.on('error', function (err) {
        console.log(err);
    });

    producer.send(payloads, function (err, data) {
        res.json(data);
    });
});

module.exports = router;
