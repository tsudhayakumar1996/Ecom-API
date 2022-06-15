const express = require ('express')
const CartListSchema = require('../Models/cartLists')
const router = express.Router()
const authVerify = require('../Verification/tokenVerification')

router.post('/',authVerify, async (req,res)=>{  
    
    const userHaveCartList = await CartListSchema.findOne({user_id:req.body.user_id})
    
    if(userHaveCartList){        
        let initArr = userHaveCartList.cart_lists        
        let cart_lists_obj = {}
        cart_lists_obj.unique_id = Date.now()
        cart_lists_obj.product_id = req.body.product_id
        cart_lists_obj.product_name = req.body.cart_lists.product_name
        cart_lists_obj.size = req.body.cart_lists.size
        cart_lists_obj.total_qty = req.body.cart_lists.total_qty        
        cart_lists_obj.product_image = req.body.cart_lists.product_image
        cart_lists_obj.indiv_price = req.body.cart_lists.indiv_price
        cart_lists_obj.act_size = req.body.cart_lists.act_size
        initArr.unshift(cart_lists_obj)                               

        try{
            await CartListSchema.updateOne(
                {user_id:req.body.user_id},
                {$set:{cart_lists:initArr}}
            )            
            const successMessage = {
                status: "success",
                data : initArr
            }
            res.json(successMessage)
        }catch(err){
            res.json({message:err})
        }
    }else{    
        const initArr = []            
        const addCartListObj = {}
        addCartListObj.product_id = req.body.product_id
        addCartListObj.unique_id = Date.now()
        addCartListObj.product_name = req.body.cart_lists.product_name
        addCartListObj.size = req.body.cart_lists.size
        addCartListObj.total_qty = req.body.cart_lists.total_qty        
        addCartListObj.product_image = req.body.cart_lists.product_image
        addCartListObj.indiv_price = req.body.cart_lists.indiv_price
        addCartListObj.act_size = req.body.cart_lists.act_size
        initArr.unshift(addCartListObj)                     
        const cartList = new CartListSchema({
            user_id : req.body.user_id,             
            cart_lists : initArr,                     
        })               
        try{
            const savedCartList = await cartList.save()
            const successMessage = {
                status: "success",
                data : savedCartList
            }
            res.json(successMessage)
        }catch(err){
            res.json({message:err})
        } 
    } 
})

router.get('/:user_id', authVerify, async(req,res)=>{       
    try{
        const cartLists = await CartListSchema.findOne({user_id:req.params.user_id})        
        if(cartLists){
            res.json(cartLists)
        }else{
            res.json({cart_lists:[]})
        }        
    }catch(err){
        res.json({message:err})
    }
})

router.delete('/:user_id/:unique_id',authVerify, async (req,res)=>{

    const userHaveCartList = await CartListSchema.findOne({user_id:req.params.user_id})        
    try{
        if(userHaveCartList.cart_lists.length === 1){            
            const deletedPost = await CartListSchema.deleteOne({user_id:req.params.user_id})                                 
            res.json([]) 
        }else{
            const filteredLists = userHaveCartList.cart_lists.filter(e=>e.unique_id !== Number(req.params.unique_id))          
            await CartListSchema.updateOne(
                {user_id:req.params.user_id},
                {$set:{cart_lists:filteredLists}}
            )             
            res.json(filteredLists)
        }
    }catch(err){
        res.json({message:err})
    }
})

router.patch('/:user_id/:unique_id',authVerify,async(req,res)=>{
    const newCartListToUpdate = {}
    newCartListToUpdate.product_id = req.body.product_id
    newCartListToUpdate.unique_id = req.body.unique_id
    newCartListToUpdate.product_name = req.body.product_name
    newCartListToUpdate.size = req.body.size
    newCartListToUpdate.total_qty = req.body.total_qty
    newCartListToUpdate.product_image = req.body.product_image
    newCartListToUpdate.indiv_price = req.body.indiv_price
    newCartListToUpdate.act_size = req.body.act_size
    const userHaveCartList = await CartListSchema.findOne({user_id:req.params.user_id})  
    const copyOfCartLists = userHaveCartList.cart_lists   
    let index = 0
    userHaveCartList.cart_lists.map((each,i)=>{
        if(each.unique_id === Number(req.params.unique_id)){            
            index = i
        }
    })
    copyOfCartLists[index] = newCartListToUpdate
    const updatedCartList = await CartListSchema.updateOne(
        {user_id:req.params.user_id},
        {$set:{cart_lists:copyOfCartLists}}
    )
    res.json({status:"success"})
})

module.exports = router