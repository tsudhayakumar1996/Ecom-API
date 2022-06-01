const express = require ('express')
const CartListSchema = require('../Models/cartLists')
const router = express.Router()
const authVerify = require('../Verification/tokenVerification')

router.post('/',authVerify, async (req,res)=>{  
    
    const userHaveCartList = await CartListSchema.findOne({user_id:req.body.user_id})
    console.log(userHaveCartList,"cart lists response from db")
    if(userHaveCartList){
        let initArr = userHaveCartList.cart_lists
        let needPushArr = req.body.cart_lists
        initArr.push(needPushArr)                    
        try{
            const updatedCartList = await CartListSchema.updateOne(
                {user_id:req.body.user_id},
                {$set:{cart_lists:initArr}}
            )
            console.log("updatedCartList___________",updatedCartList)
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
        addCartListObj.product_name = req.body.cart_lists.product_name
        addCartListObj.size = req.body.cart_lists.size
        addCartListObj.qty = req.body.cart_lists.qty        
        addCartListObj.product_image = req.body.cart_lists.product_image
        addCartListObj.indiv_price = req.body.cart_lists.indiv_price
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

module.exports = router