
const mongourl='mongodb://test:Mytest1@ds255463.mlab.com:55463/assignment5';

function main(params) {
    if(!params || params.size===0){
        return({status:"error, no params"});
    }
    var MongoClient = require('mongodb').MongoClient;
    return new Promise(function(resolve, reject){
        MongoClient.connect(mongourl, { useNewUrlParser: true }, function(error, database){
            if (error){
                reject({status:"error with database"});
            };
            const db = database.db('assignment5');
            let collection = db.collection('data');


            let d={
                id:this.data.id,
                temp:this.data.temp,
                time:this.data.time,
                consumer:'id_2'
            };
            collection.insertOne(d, function(err2, result) {
                if(!err2){
                    console.log('insertet data!');
                    resolve({status:"success"});
                }else{
                    console.log('could not insert data')
                    reject({status:"error with inserting"});
                }

            });
            database.close();
        }.bind({data:this.data}));
    }.bind({data:params}));


    https://openwhisk.eu-gb.bluemix.net/api/v1/namespaces/dennis.sommer.86%40gmail.com_dev/actions/consumer1	}