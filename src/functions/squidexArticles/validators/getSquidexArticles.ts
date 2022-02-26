import Joi from 'joi';

export const getListAquidexArticlesSchema = {
    page: Joi.string(),
    limit: Joi.string(),
    subCategories: Joi.string()
}