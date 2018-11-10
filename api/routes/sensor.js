const express = require('express');
const router = express.Router();
const kafka = require('kafka-node');
const consumer1 = require('./../consumers/consumer1/consumer1');
const consumer2 = require('./../consumers/consumer2/consumer2');
const config = require('config');



router.post('/', function(req, res, next) {

    let nextConsumer = req.body.consumer;
    getKafkaProducer(nextConsumer, req)
        .then(rets => {
            let producer = rets.prod;
            let nextConsumer = rets.cons;
            let req = rets.req;
            let sensor = req.body.sensor;
            let value = req.body.value;
            let currentOffset = parseInt(req.body.offset,10);
            let today = new Date();
            let dd = today.getDate();
            let mm = today.getMonth()+1;
            let yyyy = today.getFullYear();
            let hh = today.getHours();
            let MM = today.getMinutes();
            let ss = today.getSeconds();

            let timestamp = dd+"-"+mm+"-"+yyyy+" "+hh+":"+MM+":"+ss;
            let message = {
                sensor: sensor,
                value: value,
                time: timestamp
            };
            let payload = {
                topic : config.get("topic"),
                messages: JSON.stringify(message),
                partition: 0
            };
            producer.send([payload], function (err, data) {
                //const url1="https://MEINAPIUSER:MEINAPIKEY@openwhisk.eu-gb.bluemix.net/api/v1/namespaces/p.haeusle%40student.uibk.ac.at_dev/actions/Consumer1";
                switch (nextConsumer) {
                    case "consumer1":
                        consumer1.consumeFromKafka(currentOffset, currentOffset)
                            .then(offset => {
                                currentOffset = offset;
                            });
                        break;
                    case "consumer2":
                        consumer2.consumeFromKafka(currentOffset, currentOffset)
                            .then(offset => {
                                currentOffset = offset;
                            });
                        break;
                }
                res.status(200).json({message:"ok"});
            });
        })
        .catch(err => {
            res.status(400).json({message:"Error."});
        })

});

module.exports = router;

function getKafkaProducer(consumer, req) {
    return new Promise(function (resolve, reject) {
        let Producer = kafka.Producer;
        let client = new kafka.KafkaClient({kafkaHost: config.get("KafkaHost")});
        let producer = new Producer(client);
        producer.on('ready', function () {
            console.log("Producer ready.");
            resolve({
                prod:producer,
                cons: consumer,
                req: req
            });
        });
        producer.on('error', function (err) {
            console.log(err);
            reject(err);
        });

    });
}