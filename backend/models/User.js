const mongoose=require("mongoose");
const Schema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true,
    },
    Image:{
        type:String,
        required:true
    }
})

const modeled=mongoose.model("userDetails",Schema);
module.exports=modeled;

