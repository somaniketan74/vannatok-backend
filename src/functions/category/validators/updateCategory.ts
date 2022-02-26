const Joi = require('joi')
export const updateCategorySchema = {
    name: Joi.string().required(),
    pathParameters: Joi.object({
        id: Joi.string().required()
    })
}