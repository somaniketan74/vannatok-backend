import Joi from 'joi';

export const updateCommentSchema = {
    text: Joi.string().required(),
    pathParameters: Joi.object({
        id: Joi.string().required()
    })
}