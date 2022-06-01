const mongoose  = require("mongoose");


const PostSchema = mongoose.Schema({
    post:{
        type : String,
        required : true
    },
    productId:{
        type : String,
        required : true
    },
    userId:{
        type : String,
        required : true
    }    
})

module.exports = mongoose.model('Posts',PostSchema)