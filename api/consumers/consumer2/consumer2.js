let consumer2 = {};

const config = require('config');
const nano = require('nano')(config.get("DBUrl"));
const kafka = require('kafka-node');

consumer2.consumeFromKafka = function (offset){
    return new Promise(function (resolve, reject) {
        let client = new kafka.KafkaClient({kafkaHost: config.get("KafkaHost")});
        let Consumer = kafka.Consumer;
        let consumer = new Consumer(client,
            [
                { topic:config.get("topic"), partition:0, offset:offset}
            ],
            {
                autoCommit:false
            });
        consumer.on('message', function (message) {
            initCouchDB()
                .then(couch =>{
                    if(couch){
                        insertValueIntoDB(message)
                            .then( name =>{
                                resolve(message.offset);
                            })
                            .catch(err =>{
                                console.log(err);
                                reject(err);
                            })
                    }
                })
                .catch( err =>{
                    console.log("Error with couchDB");
                    reject(err);
                });
        });
    });
};


module.exports = consumer2;

function insertValueIntoDB(message) {
    let sensorOut = nano.use(config.get("DBName"));
    return new Promise(function (resolve, reject) {
        let documentName = (((Math.round((new Date()).getTime() / 1000))+(Math.random() * 1000) + 1).toFixed(0)).toString();
        let sensorValues = JSON.parse(message.value);
        let sensorObj ={
            sensor: sensorValues.sensor,
            value: sensorValues.value,
            time: sensorValues.time,
            timestamp: message.timestamp,
            consumer:"consumer2"
        };
        sensorOut.insert(sensorObj, documentName)
            .then(resp =>{
                console.log("Successfully saved sensor data in DB");
                resolve(documentName);
            })
            .catch(err =>{
                console.error("Couldnt save sensor data in DB.", err);
                reject(err);
            })
    });

}

function initCouchDB() {
    let dbExists = false;
    return new Promise(function (resolve, reject) {
        nano.db.list().then((body) => {
            body.forEach((db) => {
                if(db === config.get("DBName")){
                    dbExists = true;
                }
            });
            if(!dbExists){
                nano.db.create(config.get("DBName"))
                    .then(resp =>{
                        console.log("DB created ", resp);
                        resolve(true);
                    })
                    . catch(err =>{
                        console.error("DB error ", err);
                        reject(false);
                    })
            }else{
                console.log("DB existed.");
                resolve(true);
            }

        });
    });
}