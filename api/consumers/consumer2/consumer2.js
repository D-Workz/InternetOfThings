let consumer2 = {};

const kafka = require('kafka-node');
const topic = "sensor1741212311";
const kafkaHost = "92.42.47.172:9092";
const dbName = "sensors";
const mongourl='mongodb://92.42.47.172:27017/'+dbName;

consumer2.consumeFromKafka = function (offset){
    return new Promise(function (resolve, reject) {
        let client = new kafka.KafkaClient({kafkaHost: kafkaHost});
        let Consumer = kafka.Consumer;
        let consumer = new Consumer(client,
            [
                { topic:topic, offset:offset, partition:0}
            ],
            {
                autoCommit:false,
                fromOffset: true
            });
        consumer.on('message', function (message) {
            var MongoClient = require('mongodb').MongoClient;
            MongoClient.connect(mongourl, { useNewUrlParser: true }, function(error, database) {
                if (error) {
                    reject({status: "error with database"});
                }
                const db = database.db(dbName);
                let collection = db.collection('data');

                let sensorValues = JSON.parse(message.value);
                let sensorObj ={
                    sensor: sensorValues.sensor,
                    value: sensorValues.value,
                    time: sensorValues.time,
                    timestamp: message.timestamp,
                    consumer:"consumer2"
                };
                collection.insertOne(sensorObj, function (err2, result) {
                    if (!err2) {
                        console.log('wrote sensor values in db...');
                        consumer.close(function (err, offset) {
                            if(err){
                                reject(err);
                            }else{
                                console.log("Successfully closed consumer2.");
                                resolve({status: "success", offset:offset});
                            }
                        })
                    } else {
                        console.log('could not write sensor values in db');
                        reject({status: "error with inserting"});
                    }
                });
                database.close();
            });
        });
    });
};


module.exports = consumer2;
