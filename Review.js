const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

name:String,

review:String,

rating:Number,

image:String,

approved:{
type:Boolean,
default:false
}

});

module.exports =
mongoose.model("Review",reviewSchema);
