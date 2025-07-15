const mongoose = require('mongoose');

const connectTODb = async () => {
    try{
        await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("mongodb connected successfully")
    }
    catch(e){
        console.log("MongoDB could not be connected",e);
        process.exit(1);
    }
}
module.exports = connectTODb; 