const express = require ('express')
const router = express.Router()
const Postschema = require('../Models/posts')
const authVerify = require('../Verification/tokenVerification')

router.get('/',authVerify, async (req,res)=>{
    try{
        const postsList = await Postschema.find()
        res.json(postsList)
    }catch(err){
        res.json({message:err})
    }
})

router.post('/',authVerify, async (req,res)=>{
    const post = new Postschema({
        post : req.body.post,
        productId : req.body.product_id,
        userId : req.body.user_id
    })
    try{
        const savedPost = await post.save()
        res.json(savedPost)
    }catch(err){
        res.json({message:err})
    }
    
})

// router.get('/:id',authVerify, async (req,res)=>{
//     try{            
//         const postByID = await Postschema.findById(req.params.id)
//         res.json(postByID)
//     }catch(err){
//         res.json({message:err})
//     }
// })

router.delete('/:id',authVerify, async(req,res)=>{
    try{
        const deletedPost = await Postschema.deleteOne({_id:req.params.id})
        res.json(deletedPost)
    }catch(err){
        res.json({message:err})
    }
})

router.patch('/:id',authVerify, async(req,res)=>{
    try{
        const updatedPost = await Postschema.updateOne(
            { _id:req.params.id },
            { $set:{title: req.body.title} }
        )
        res.json(updatedPost)        
    }catch(err){
        res.json({message:err})
    }
})

module.exports = router