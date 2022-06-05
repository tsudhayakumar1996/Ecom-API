const express = require ('express')
const { findOne } = require('../Models/cartLists')
const CartListSchema = require('../Models/cartLists')
const router = express.Router()
const authVerify = require('../Verification/tokenVerification')

router.post('/',authVerify, async (req,res)=>{  
    
    const addCartListObj = {}
    addCartListObj.unique_id = Date.now()
    addCartListObj.product_id = req.body.cart_lists.product_id
    addCartListObj.product_name = req.body.cart_lists.product_name
    addCartListObj.size = req.body.cart_lists.size
    addCartListObj.qty = req.body.cart_lists.qty        
    addCartListObj.product_image = req.body.cart_lists.product_image
    addCartListObj.indiv_price = req.body.cart_lists.indiv_price

    const userHaveCartList = await CartListSchema.findOne({user_id:req.body.user_id})    
    if(userHaveCartList){
        let initArr = userHaveCartList.cart_lists                
        initArr.push(addCartListObj)                    
        try{
            const updatedCartList = await CartListSchema.updateOne(
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
        initArr.push(addCartListObj)                     
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

router.delete('/',authVerify,async (req,res) => {    
    const findTheUser = await CartListSchema.findOne({
        user_id : req.body.user_id 
    })
    try{
        const deletableIndex = req.body.delete_list_id
        const initArr = findTheUser.cart_lists
        const filtered = initArr.filter(e=>e.unique_id !== Number(deletableIndex))         
        const filteredArr = []  
        filtered.map((e)=>{
            filteredArr.push(e)  
        })                                                     
        await CartListSchema.updateOne(
            {user_id:req.body.user_id},
            {$set:{cart_lists:filteredArr}}
        )
            const successMessage = {
                status: "success",
                data : filteredArr
            }
        res.json(successMessage)
    }catch(err){
        res.json({message:err})
    }       
})

module.exports = router