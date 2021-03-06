const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({    
    name : {
        type : String,
        required : true,        
    },
    phone_no : {
        type : Number,
        required : true,
        min :10
    },
    password : {
        type : String,
        required : true,
        min :6
    },
    date:{
        type : Date,
        default : Date.now
    },
    user_image:{
        type:String,
        required:false
    },    
})

module.exports = mongoose.model('User',UserSchema)