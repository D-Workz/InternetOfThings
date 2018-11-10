const express = require('express');
const router = express.Router();
const kafka = require('kafka-node');
const config = require('config');
const request = require('request');

// For NODE
const consumer1 = require('./../consumers/consumer1/consumer1');
const consumer2 = require('./../consumers/consumer2/consumer2');




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
            let timestamp = getDate();
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
                invokeConsumerOnOpenwhisk(nextConsumer,currentOffset);
                // invokeConsumerOnNode(nextConsumer, currentOffset);
                res.status(200).json({message:"ok"});
            });
        })
        .catch(err => {
            res.status(400).json({message:"Error."});
        })

});

module.exports = router;

function invokeConsumerOnNode(consumer, currentOffset) {
    switch (consumer) {
        case "consumer1":
            consumer1.consumeFromKafka(currentOffset)
                .then(offset => {
                    currentOffset = offset;
                });
            break;
        case "consumer2":
            consumer2.consumeFromKafka(currentOffset)
                .then(offset => {
                    currentOffset = offset;
                });
            break;
    }
}

function getDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
    let hh = today.getHours();
    let MM = today.getMinutes();
    let ss = today.getSeconds();
    return dd+"-"+mm+"-"+yyyy+" "+hh+":"+MM+":"+ss;
}


function invokeConsumerOnOpenwhisk(consumer, offset) {
    let url ="https://"+ config.get('IBM_ApiKey') +config.get('IBM_ActionURL');
    switch (consumer) {
        case "consumer1":
            url = url.concat("consumer1");
            break;
        case "consumer2":
            url = url.concat("consumer2");
            break;
    }
    return new Promise(function (resolve, reject) {
        request({
            url: url,
            method: "POST",

            json: {"offset": offset}
        }, function (error, response, body) {
            if(error){
                console.log(error);
                reject(error);
            }else {
                resolve(response);
            }

        });

    });
}

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