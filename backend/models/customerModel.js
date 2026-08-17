const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const customerSchema = new mongoose.Schema({

    name:{
        type : String,
        required : true,
        trim : true
    },

    email:{
        type : String,
        unique : true,
        trim : true,
        lowercase : true,
        required : [true , "Please enter email address ."]
    },

    password:{
        type : String,
        required : [true , "Please enter Password ."],
        minlength : 8,
        trim : true,
        select : false
    },

    passwordConfirm:{
        type : String,
        minlength : 8,
        trim : true,
        required : [true , "Please confirm your Password"]
    },  

    salesmanId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : false,
    },

    isActive:{
        type : Boolean,
        default : true
    }

},
{timestamps : true}
)


customerSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return;
    }

    if(this.password !== this.passwordConfirm){
        throw new Error("Passwords do not match");
    }

    this.password = await bcrypt.hash(this.password , 12);
    this.passwordConfirm = undefined;
});

customerSchema.methods.checkPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("Customer",customerSchema);