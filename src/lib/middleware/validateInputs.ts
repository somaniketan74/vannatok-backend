import joi from 'joi'
import { NextFunction, HandlerLambda } from 'middy'
import { HttpError, R } from '../utils'
import { AWSTypes, ResponsesTypes } from '../types'

export const validateInput = <Q = {}, B = {}, P = {}>(validationSchema: object) => ({
    before: (handler: HandlerLambda<AWSTypes.Event<Q, B, P>, ResponsesTypes.LambdaResponse>, next: NextFunction) => {
        const { body, queryStringParameters, pathParameters } = handler.event
        const hasBody = !R.isNilOrEmpty(body)
        let objToValidate:any = hasBody
            ? body
            : queryStringParameters
        objToValidate = (pathParameters && Object.keys(pathParameters).length)? { ...objToValidate, pathParameters } : objToValidate;
        const schema = joi.object(validationSchema);

        console.log("Input -> "+JSON.stringify(objToValidate));
        const { error, value } = schema.validate(objToValidate)

        if (error) {
            // tslint:disable-next-line no-console
            console.log('[ERROR]: validate error', error)

            throw new HttpError().BadRequest(undefined, undefined, {error: error?.stack})
        }

        hasBody
            ? handler.event.body = body as B
            : handler.event.queryStringParameters = queryStringParameters as Q
        
        if (pathParameters)
            handler.event.pathParameters = pathParameters as P

        return next()
    },
    onError: (_: HandlerLambda, next: NextFunction) => {
        return next()
    }
})
