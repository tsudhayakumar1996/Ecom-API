const express = require ('express')
const router = express.Router()
const UserSchema = require ('../Models/users')
const registerValidation = require('../Validation/registerValidation') 
const bcrypt = require('bcryptjs')

router.post('/',async (req,res) => {
    //validating the datas
    const countErr = {
        msg:"Phone no must has 10 numbers and password should has 6 characters and username must be 2 characters"
    }
    const {error} = registerValidation(req.body)  
    if(error) return res.status(400).send(countErr)

    //check for the mbl no already exists....
    const phoneErr = {
        msg:"This phone no is already exist please try a different one"
    }
    const find_mblNo = await UserSchema.findOne({phone_no : req.body.phone_no})
    if (find_mblNo) return res.status(400).send(phoneErr)

    //hash the password
    const salt = await bcrypt.genSalt(10)
    const hassedPass = await bcrypt.hash(req.body.password,salt)

    //send the data to db after validated it..
    const user = new UserSchema({        
        name : req.body.name,        
        phone_no : req.body.phone_no,
        password : hassedPass
    })
    try{
        const saveUser = await user.save()
        res.send({
            name : saveUser.name,
            phone_no:saveUser.phone_no,
            user_id:saveUser._id,
            msg:"success"
        })
    }catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router