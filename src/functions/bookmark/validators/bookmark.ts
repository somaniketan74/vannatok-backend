import Joi from 'joi';

export const createBookmarkSchema = {
    contentId: Joi.string().required()
}

export const deleteBookmarkSchema = {
    pathParameters: Joi.object({
        id: Joi.string().required()
    })
}

export const getBookmarkSchema = {
    page: Joi.string(),
    limit: Joi.string()
}