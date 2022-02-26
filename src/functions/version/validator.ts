import Joi from 'joi';

export const updateVersionSchema = {
    app: Joi.string().required(),
    version: Joi.string().required()
}

export const getVersionSchema = {
    app: Joi.string().required()
}