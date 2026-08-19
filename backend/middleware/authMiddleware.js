const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
/*const Customer = require("../models/customerModel");*/

exports.protect = async (req,res,next) => {
    try{
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                status : "fail",
                message : "You are not logged in. Please log in to get access."
            });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({
                status : "fail",
                message : "The user belonging to this token no longer exists"
            });
        }

        if (!currentUser.isActive) {
            return res.status(401).json({
                status : "fail",
                message : "This account has been deactivated."
            });
        }

        req.user = currentUser;
        next();

    }catch(err){
        return res.status(401).json({
            status : "fail",
            message : "Invalid or expired token. Please log in again."
        });
    }
};

/*exports.protectCustomer = async (req, res, next) => {
    try{
        let token;

       if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }

        if(!token){
            return res.status(401).json({
                status : 'fail',
                message : "You are not logged in. Please log in to get access."
            });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const currentCustomer = await Customer.findById(decoded.id);

        if(!currentCustomer){
            return res.status(401).json({
                status : 'fail',
                message : "Customer belonging to this token no longer exists."
            });
        }

        if(!currentCustomer.isActive){
            return res.status(401).json({
                status : 'fail',
                message : "This account is no longer active."
            });
        }

        req.customer = currentCustomer;
        next();

    }catch(err){
        return res.status(401).json({
            status : 'fail',
            message : "Invalid or expired token. Please log in again."
        });
    }
};*/

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status : "fail",
                message : "You do not have permisiion to perform this action."
            });
        }
        next();
    };
};