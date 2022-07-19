const mongoose = require("mongoose")

const ProductScheme = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:String,
        required:true
    },
    product_image:{
        type:String,
        required:true
    },
    other_images:Array,
    sizes:Array
})

module.exports = mongoose.model('Product',ProductScheme)