const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        lowercase: true,
        minLength: 3,
        maxLength: 10,
    },
    firstName:{
        type:String,
        maxLength: 20,
        trim:true,
        require:true,
    },
    lastName:{
        type:String,
        maxLength: 20,
        trim:true,
        require:true,
    },
    password:{
        type:String,
        minLength: 6,
        require:true,
    },
})

const User = new mongoose.model("User", userSchema);

module.exports ={
    User
};