const express = require('express');
const mongoose = require('mongoose');
const app = express()
require ("dotenv/config")
const postRoute = require('./Routes/posts')
const userRoute = require('./Routes/register')
const loginRoute = require('./Routes/login')
const productRoute = require('./Routes/product')
const bodyParser = require('body-parser');
const cartListRoute = require('./Routes/cartLists')


// body-parser on every request hit..
app.use(bodyParser.json())

//Routes
app.use('/posts',postRoute)
app.use('/register',userRoute)
app.use('/login',loginRoute)
app.use('/product',productRoute)
app.use('/uploads',express.static('uploads'))
app.get('/',(req,res)=>{
    res.send("we are listening")
})
app.use('/cart_list',cartListRoute)

//mongoDB connection
const mongoConnect = process.env.DB_connection
mongoose.connect(mongoConnect, {useNewUrlParser:true}, ()=>{
    console.log('connected to db')
})

//listening on port
app.listen(process.env.PORT || 3000)  

module.exports = app