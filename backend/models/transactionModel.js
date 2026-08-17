const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new mongoose.Schema({

    customerId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Customer',
        required : true
    },

    orderId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Order',
        required : false
    },

    type:{
        type : String,
        enum : [ "debit" , "credit" ],
        required : true
    },

    amount:{
        type : Number,
        required : true,
        min : 0
    },

    recordedBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    description:{
        type : String,
        trim : true,
        required : false
    }

},
{timestamps : true}
)

module.exports = mongoose.model("Transaction",transactionSchema);