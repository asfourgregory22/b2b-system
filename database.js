
const mongoose = require('mongoose');

mongoose.set('strictQuery',false);


exports.connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connect to database");
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}