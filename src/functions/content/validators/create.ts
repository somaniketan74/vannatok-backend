import Joi from "joi";

export const createViewSchema = {
    contentId: Joi.string().required(),
    userId: Joi.string().required(),
    duration: Joi.number().required()
}