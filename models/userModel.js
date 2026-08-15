const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({

    name:{
        type : String,
        required : [ true , "Please enter username ."],
        minLength : 5,
        trim : true
    },

    email:{
        type : String,
        unique : true,
        lowercase : true,
        required : [true , "Please enter email address ."]
    },

    password:{
        type : String,
        minlength : 8,
        trim : true,
        required : [true , "Please enter your Password"]
    },

    passwordConfirm:{
        type : String,
        minlength : 8,
        trim : true,
        required : [true , "Please confirm your Password"]
    },

    passwordChangedAt: Date,

    role:{
        type : String,
        required  : [true , "Please assign role"],
        enum : ["admin" , "stock_manager" , "accountant" , "general_manager" , "salesman"]
    },

    isActive:{
        type : Boolean,
        default : true
    }

},
{timestamps : true}
)

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return;
    }

    if(this.password !== this.passwordConfirm){
        throw new Error("Passwords do not match");
    }

    this.password = await bcrypt.hash(this.password , 12);
    this.passwordConfirm = undefined;
});

userSchema.methods.checkPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User",userSchema);