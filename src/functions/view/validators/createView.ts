import Joi from 'joi';

export const createViewSchema = {
    contentId: Joi.string().required(),
    duration: Joi.number()
}

export const getListViewSchema = {
    page: Joi.string(),
    limit: Joi.string(),
    contentId: Joi.string(),
    userId: Joi.string()
}