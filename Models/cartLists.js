const mongoose = require('mongoose')

const CartListSchema = mongoose.Schema({
    user_id:{
        type:String,
        require:true
    },    
    cart_lists: Array,       
})

module.exports = mongoose.model('CartLists',CartListSchema)