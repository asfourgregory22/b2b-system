const Customer = require("../models/customerModel");
const User = require('../models/userModel');
const jwt = require("jsonwebtoken");


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.registerCustomer = async (req, res) => {
    try{
        const { name, email, password, passwordConfirm, salesmanId} = req.body;

        const newCustomer = await Customer.create({ name, email, password, passwordConfirm, salesmanId});
        const token = signToken(newCustomer._id);

        newCustomer.password = undefined;

        res.status(201).json({
            status : 'success',
            token,
            data : { customer : newCustomer }
        });

    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};

exports.loginCustomer = async (req,res) => {
    try{
        const {email,password} = req.body;

        const customer = await Customer.findOne({email}).select('+password');

        if(!customer){
            return res.status(404).json({ message : "Customer not found."});
        };

        if(!( await customer.checkPassword( password, customer.password))){
            return res.status(401).json({ message : "Incorrect email or password."});
        };

        const token = signToken(customer._id);
        customer.password = undefined;

        res.status(200).json({
            status : 'success',
            token,
            data : { customer }
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};

exports.getMeCustomer = async (req, res) => {
    res.status(200).json({
        status : 'success',
        data : { customer : req.customer }
    });
};

exports.deactivateCustomer = async (req, res) => {
    try{
        const deactivatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { isActive : false },
            { new : true }
        );

        if(!deactivatedCustomer){
            return res.status(404).json({
                status : 'fail',
                message : "No customer found with that id"
            });
        }

        res.status(200).json({
            status : 'success',
            data : { customer : deactivatedCustomer }
        });

    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};

exports.assignSalesman = async (req,res) => {
    try{
        const { salesmanId } = req.body;

        const salesman = await User.findOne({_id: salesmanId, role: 'salesman' });

        if(!salesman){
            return res.status(404).json({
                status : 'fail',
                message : "No salesman found with  that ID."
            });
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { salesmanId },
            {   new : true,
                runValidators : true
            }
        );

        if(!updatedCustomer){
            return res.status(404).json({
                status : 'fail',
                message : "No customer found with that ID."
            });
        }

        res.status(200).json({
            status : 'success',
            data : { customer : updatedCustomer }
        });

    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};