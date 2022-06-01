const Joi = require('@hapi/joi')

const loginValidation = (data) => {
    const schema = Joi.object({            
        password : Joi.string().min(6).required(),
        phone_no : Joi.string().min(10).max(10).required()
    })  
    
    //validating the datas
    return schema.validate(data)
}

module.exports = loginValidation