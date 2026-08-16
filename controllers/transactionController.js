const Transaction = require('../models/transactionModel');

exports.recordPayment = async(req,res) => {
    try{
        const{ customerId, amount, description } = req.body;

        const newTransaction = await Transaction.create({
            customerId,
            type : 'credit',
            amount,
            description,
            recordedBy : req.user._id
        });

        res.status(201).json({
            status : 'success',
            data : { transaction : newTransaction }
        });
    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};