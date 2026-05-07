const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({

    name:String,
    email:String,
    phone:String,
    message:String

});

module.exports = mongoose.model(
"Quote",
quoteSchema
);