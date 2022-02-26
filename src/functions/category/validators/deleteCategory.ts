const Joi = require('joi')
export const deleteCategorySchema = {
    pathParameters: Joi.object({
        id: Joi.string().required()
    })
}