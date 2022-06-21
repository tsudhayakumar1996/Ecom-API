const express = require ('express')
const router = express.Router()
const UserSchema = require ('../Models/users')
const registerValidation = require('../Validation/registerValidation') 
const bcrypt = require('bcryptjs')
const authVerify = require('../Verification/tokenVerification')
const multer = require('multer')

//setting storage
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})
//make condition for file type to upload
const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null,true);
    } else{
        cb(null,false);
    }       
}
//make file size limit to 5MB
const upload = multer({storage,
    fileFilter,
    limits:{
        fileSize: 1024*1024*5
    },    
})

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

router.patch("/:user_id",authVerify,upload.single("userImage"),async (req,res)=>{    
    const findUser = await UserSchema.findOne({_id:req.params.user_id})
    console.log(findUser,req.file,"heroku check............")
    try{
        await UserSchema.updateOne(
            {_id:req.params.user_id},
            {$set:{user_image:req.file.path}}
        )    
        res.status(400).send({status:"success"})
    }catch(err){
        res.json({message:err})
    }
})

module.exports = router