const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({

    customerId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    salesmanId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : false
    },

    submittedBy:{
        type : mongoose.Schema.Types.ObjectId,
        refPath : 'submittedByModel',
        required : true
    },

    submittedByModel:{
        type : String,
        required : true,
        enum : ['User']
    },

    status:{
        type : String,
        required : true,
        default : 'pending_approval',
        enum : ['pending_approval',
                'approved',
                'rejected',
                'shipped',
                'delivered']
    },

    totalAmount:{
        type : Number,
        required : true,
        min : 0
    },//This would be the sum of all OrderItem.priceAtOrder * quantity for this order

    rejectionReason:{
        type : String,
        trim : true,
    }

},
{timestamps : true}
)

module.exports = mongoose.model("Order",orderSchema);