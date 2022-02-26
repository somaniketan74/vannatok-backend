import Joi from 'joi';

export const createCommentSchema = {
    contentId: Joi.string().required(),
    text: Joi.string().required()
}

export const getListCommentSchema = {
    page: Joi.string(),
    limit: Joi.string(),
    contentId: Joi.string(),
    userId: Joi.string()
}