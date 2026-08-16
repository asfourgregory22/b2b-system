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
            return res.status(404).json({message:"User not found."});
        };

        if(!(await user.checkPassword( password, user.password))){
            return res.status(401).json({message:"Incorrect email or password."});
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