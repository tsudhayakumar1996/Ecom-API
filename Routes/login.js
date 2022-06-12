const bcrypt = require('bcryptjs')
const express = require ('express')
const router = express.Router()
const UserSchema = require ('../Models/users')
const CartListSchema = require ('../Models/cartLists')
const loginValidation = require ('../Validation/loginValidation')
const jwt = require('jsonwebtoken')
require ("dotenv/config")

router.post('/',async (req,res) => {
    //validate the data lengths and quality    
    const {error} = loginValidation(req.body)
    console.log(error)
    const countErr = {
        msg:"Phone no must has 10 numbers and password should has 6 characters"    
    }
    if (error) return res.status(400).send(countErr)

    //check for the phone_no exists
    const err = {
        msg:"Entered phone no or password is wrong"
    }
    const user = await UserSchema.findOne({phone_no:req.body.phone_no})    
    const userCartBatchIcon = await CartListSchema.findOne({user_id:user._id})  
    const badge_count = userCartBatchIcon ? userCartBatchIcon.cart_lists.length : 0  
    if(!user) return res.status(400).send(err)

    //check for the password is correct
    const validatePass = await bcrypt.compare(req.body.password, user.password)
    if(!validatePass) return res.status(400).send(err) 
    
    //token process
    const token = jwt.sign({_id:UserSchema._id},process.env.TOKEN_SECRET)
    const response = {
        status:"success",
        token:token,
        phone_no:user.phone_no,
        name:user.name,
        user_id:user._id,
        badge_count: badge_count
    }
    res.header('auth-token',token).send(response)       
})

module.exports = router