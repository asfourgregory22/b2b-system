const user = require("../models/userModel");
const validator = require("validator");
const  jwt = require("jsonwebtoken");
const {promisify} = reqiure("util");

const signToken = (id) => {
    return jwt.sign( {id}  ,process.env.JWT_SECTRET,{
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

