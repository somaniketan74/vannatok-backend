import Joi from "joi";

export const getSkillListSchema = {
    q: Joi.string(),
    page: Joi.number(),
    limit: Joi.number()
}