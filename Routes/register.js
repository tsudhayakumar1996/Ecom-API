const express = require ('express')
const router = express.Router()
const UserSchema = require ('../Models/users')
const registerValidation = require('../Validation/registerValidation') 
const bcrypt = require('bcryptjs')
const authVerify = require('../Verification/tokenVerification')
const fs = require('fs')
const path = require('path')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


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
        password : hassedPass,
        user_image : ""
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

router.patch("/:user_id",authVerify,async (req,res)=>{
        
    console.log(req.body,"heroku check............")
    const findUser = await UserSchema.findOne({_id:req.params.user_id}) 
    try{
        fs.writeFile(
            path.join('uploads',req.body.file_name),
            req.body.file,            
            'base64',
            (err)=>{ if(err) throw err}
        )  

        await UserSchema.updateOne(
            {_id:req.params.user_id},
            {$set:{user_image:"uploads/"+req.body.file_name}}
        )    
        res.send({status:"success"})
    }
    catch(err){
        res.json({message:err})
    }    
})

module.exports = router