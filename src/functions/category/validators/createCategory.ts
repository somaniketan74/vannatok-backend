const Joi = require('joi')
export const createCategorySchema = {
    name: Joi.string().required()
}