const User = require("../models/userModel");
const validator = require("validator");
const  jwt = require("jsonwebtoken");
const {promisify} = require("util");

const signToken = (id) => {
    return jwt.sign( {id}  ,process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
};

exports.register = async (req,res) => {
    try{
        const { name, email, password, passwordConfirm, role } = req.body;

        if( role === "customer" ){
            return res.status(400).json({
                status : "fail",
                message: 'Use the customer creation endpoint to register customers'
            });
        }

        const newUser = await User.create({ name, email, password, passwordConfirm, role });
        const token = signToken(newUser._id);

        newUser.password = undefined;

        res.status(201).json({status:'success',
            token,
            data : {
                user : newUser
            }
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status : "fail",
            message : err.message
        });
    }
};

exports.login = async (req,res) => {
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email}).select('+password');
     
        if(!user){
            return res.status(404).json({
                status : "fail",
                message :"User not found."
            });
        };

        if(!(await user.checkPassword( password, user.password))){
            return res.status(401).json({
                status : "fail",
                message:"Incorrect email or password."
            });
        };

        if (!user.isActive){
            return res.status(401).json({
                status : 'fail',
                message : "This account has been deactivated"
            })
        }

        const token = signToken(user._id);
        user.password = undefined;

        res.status(200).json({
            status: 'success',
            token,
            data : {
                user
            }
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};

exports.getMe = async (req, res) => {
    res.status(200).json({
        status : 'success',
        data : {
            user : req.user
        }
    });
};

exports.updateUser = async (req, res) => {
    try{
        const { name, role, isActive } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, role, isActive },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                status : 'fail',
                message : 'No user found with that ID'
            });
        }

        res.status(200).json({
            status : 'success',
            data : { user : updatedUser }
        });

    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};

exports.resetPassword = async (req, res) => {
    try{
        const { password , passwordConfirm } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status : 'fail',
                message : 'No user found with that ID'
            });
        }

        user.password = password;
        user.passwordConfirm = passwordConfirm;
        await user.save();

        res.status(200).json({
            status : 'success',
            message : "Password reset successfully"
        })
    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};

exports.deactivateUser = async (req, res) => {
    try{

        const deactivatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { isActive : false },
            { new : true }
        );

        if(!deactivatedUser) {
            return res.status(404).json({
                status : 'fail',
                message : 'No user found with that ID.'
            });
        }

        res.status(200).json({
            status : 'success',
            data : { user : deactivatedUser }
        });

    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};

exports.createCustomer = async (req,res) => {
    try{
        const { name, email, password, passwordConfirm, salesmanId } = req.body;

        const newCustomer = await User.create({
            name, email, password, passwordConfirm,
            role : "customer",
            salesmanId : salesmanId
        });

        newCustomer.password = undefined;

        res.status(201).json({
            status: 'success',
            data: { user: newCustomer }
        });

    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};

exports.assignSalesman = async (req,res) =>{
    try{
    const { salesmanId } = req.body;

    const salesman = await User.findOne({ _id : salesmanId, role : "salesman", isActive:true});
    if(!salesman){
        return res.status(400).json({
            status : "fail",
            message : "Invalid or Inactive salesman"
        })
    }

    const updatedCustomer = await User.findOneAndUpdate(
        { _id : req.params.id, role : "customer"},
        { salesmanId },
        { new : true , runValidators : true}
    );

    if(!updatedCustomer){
        return res.status(400).json({
            status : "failed",
            message : "no customer found with that id"
        });
    }

    res.status(200).json({
        status : "success",
        data : {user : updatedCustomer}
    });

    }catch(err){
        res.status(400).json({
            status : "fail",
            message : err.message
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === 'salesman') {
            filter = {
                role: 'customer',
                salesmanId: req.user._id,
            };
        }

        const users = await User.find(filter);

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'No user found with that ID',
            });
        }

        if (req.user.role === 'salesman') {
            const isSelf = String(user._id) === String(req.user._id);
            const isAssignedCustomer = user.role === 'customer' && String(user.salesmanId) === String(req.user._id);
            if (!isSelf && !isAssignedCustomer) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'You do not have permission to view this user',
                });
            }
        }

        res.status(200).json({
            status: 'success',
            data: { user },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};