const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new mongoose.Schema({

    sku:{
        type : String,
        required : true,
        unique : true,
        trim : true,
        uppercase : true
    },

    name:{
        type : String,
        required : true,
        trim : true
    },

    description:{
        type : String,
        required : true,
        trim : true
    },

    quantity:{
        type : Number,
        required : true,
        min : 0,
        default : 0
    },

    price : {
        type : Number,
        required : true,
        min : 0
    },

    isActive:{
        type : Boolean,
        default : true
    }

},
{timestamps : true}
)

module.exports = mongoose.model("Item",itemSchema);