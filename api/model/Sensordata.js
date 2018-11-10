const mongoose = require('mongoose');
const shortId = require('shortid');
shortId.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-');


let SensordataSchema = new mongoose.Schema(
    {
        sensor: {type: String},
        value: {type: String},
        time: {type: String},
        timestamp: {type: Date},
        consumer: {type: String}
    }
);

mongoose.model('data', SensordataSchema);

