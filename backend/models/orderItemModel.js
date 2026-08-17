const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new mongoose.Schema({

    orderId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Order',
        required : true
    },

    itemId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Item',
        required : true
    },

    quantity:{
        type : Number,
        required : true,
        min : 1
    },

    priceAtOrder:{
        type : Number,
        required : true,
        min : 0
    }

},
{timestamps : true}
)

module.exports = mongoose.model("OrderItem",orderItemSchema);