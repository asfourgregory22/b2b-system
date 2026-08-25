const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//* dead code kept for future use incase of approval/rejection via email
const approvalRequestSchema = new mongoose.Schema({

    orderId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Order',
        required : true
    },

    token:{
        type : String,
        required : true,
        unique : true
    },

    status:{
        type : String,
        enum : ['pending',
                'approved',
                'rejected',
                'expired'],
        required : true,
        default : 'pending'
    },

    expiresAt:{
        type : Date,
        required : true
    },

    actionedBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : false
    }

},
{timestamps : true}
)

module.exports = mongoose.model("ApprovalRequest",approvalRequestSchema);
