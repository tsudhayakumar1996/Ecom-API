const express = require ('express')
const router = express.Router()
const authVerify = require('../Verification/tokenVerification')
const ProductSchema = require('../Models/products')
// const multer = require('multer')
//setting storage
// const storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null,'./uploads')
//     },
//     filename: function(req,file,cb){
//         cb(null,file.originalname)
//     }
// })
// //make condition for file type to upload
// const fileFilter = (req,file,cb) => {
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null,true);
//     } else{
//         cb(null,false);
//     }       
// }
// //make file size limit to 5MB
// const upload = multer({storage,
//     fileFilter,
//     limits:{
//         fileSize: 1024*1024*5
//     },    
// })
//ready to post in mongodB
// router.post('/', authVerify,upload.single('productImage'),async(req,res)=>{     
//     const sizes = req.body.sizes
//     const sizeString = sizes.split(',')    
//     const product_post = new ProductSchema({
//         title:req.body.title,
//         description:req.body.description,
//         price:req.body.price,
//         product_image:req.file.path,
//         sizes:sizeString
//     })
//     const find_product_name = await ProductSchema.findOne({title : req.body.title})
// //check for the product title already exists...
//     if(find_product_name) return res.status(400).send("This product title already exists please enter a different one :(")
//     try{
//         const savedProduct = await product_post.save()        
//         res.json(savedProduct)
//     }catch(err){
//         res.json({message:err})
//     }
// })

router.post('/', authVerify,async(req,res)=>{     
    const sizes = req.body.sizes
    const sizeString = sizes.split(',')    
    const product_post = new ProductSchema({
        title:req.body.title,
        description:req.body.description,
        price:req.body.price,
        product_image:req.file.path,
        sizes:sizeString
    })
    const find_product_name = await ProductSchema.findOne({title : req.body.title})
//check for the product title already exists...
    if(find_product_name) return res.status(400).send("This product title already exists please enter a different one :(")
    try{
        const savedProduct = await product_post.save()        
        res.json(savedProduct)
    }catch(err){
        res.json({message:err})
    }
})

//get all product details...
router.get('/',async(req,res)=>{
    try{
        const productList = await ProductSchema.find()
        res.json(productList)
    }catch(err){
        res.json({message:err})
    }
})

//get product by id...
router.get('/:id',async(req,res)=>{
    try{
        const particularProduct = await ProductSchema.findOne({_id:req.params.id})
        res.json(particularProduct)
    }catch(err){
        res.json({message:err})
    }
})

module.exports = router