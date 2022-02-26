import Joi from 'joi';

export const updateViewSchema = {
    duration: Joi.number().required(),
    pathParameters: Joi.object({
        id: Joi.string().min(24).max(24).required()
    }).required()
}