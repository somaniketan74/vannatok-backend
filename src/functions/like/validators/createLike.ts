import Joi from 'joi';

export const createLikeSchema = {
    contentId: Joi.string().required()
}