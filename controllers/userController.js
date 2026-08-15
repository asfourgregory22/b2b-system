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
        const { name, email, password, passwordConfirm, role } = req.body

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

        const user = await User.findOne({email:email});
     
        if(!user){
            return res.status(404).json({message:"User not found."});
        };

        if(!(await user.checkPassword(password,user.password))){
            return res.status(401).json({message:"Incorrect email or password."});
        };

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