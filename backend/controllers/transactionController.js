const Transaction = require('../models/transactionModel');
const User = require("../models/userModel");

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

exports.getCustomerStatement = async (req,res) => {
    try{
        const customer = await User.findById(req.params.customerId);

        if(!customer){
            return res.status(404).json({
                status : 'fail',
                message : "No customer found with that ID"
            });
        }

        if( req.user.role === "salesman" && String(customer.salesmanId) !== String(req.user._id)){
            return res.status(403).json({
                status : "fail",
                message : "You do not have permission to view this statement"
            });
        }

        const transactions = await Transaction.find({ customerId : req.params.customerId }).sort('createdAt');
 
        const balance = transactions.reduce((total, t) => {
            return t.type === 'debit' ? total + t.amount : total - t.amount;
        }, 0);

        res.status(200).json({
            status : 'success',
            results : transactions.length,
            balance,
            data : { transactions }
        });

    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};

exports.getMyStatement = async (req,res) => {
    try{
        const transactions = await Transaction.find({ customerId : req.user._id }).sort('createdAt');

        const balance = transactions.reduce((total,t) => {
            return t.type === 'debit' ? total + t.amount : total - t.amount
        }, 0);

        res.status(200).json({
            status : 'success',
            results : transactions.length,
            balance,
            data : { transactions }
        });

    }catch(err){
        res.status(400).json({
        status : 'fail',
        message : err.message
        });
    }
};