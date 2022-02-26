import httpStatusCodes from 'http-status-codes'
import { NextFunction, HandlerLambda } from 'middy'
import { AWSTypes, ResponsesTypes } from '../types'
import { headers as importedHeaders } from '../common'
import { HttpError } from '../utils'

const { CONTENT_TYPE_TYPES, HEADERS_NAMES } = importedHeaders
const { APPLICATION_JSON } = CONTENT_TYPE_TYPES
const { CONTENT_TYPE } = HEADERS_NAMES
const serverErrorCode = httpStatusCodes.INTERNAL_SERVER_ERROR
const serverErrorMessage = httpStatusCodes.getStatusText(serverErrorCode)
const isBase64Encoded = false

export const proxyResponse = <Q = {}, B = {}, P = {}>() => ({
    after: (handler: HandlerLambda<AWSTypes.Event<Q, B, P>, ResponsesTypes.FullMiddlewareResponse>, next: NextFunction) => {
        const { headers } = handler.response

        try {
            const {
                payload = {},
                message = serverErrorMessage,
                statusCode = serverErrorCode,
                headers,
                error
            } = handler.response

            if (error && error instanceof HttpError) {
                const { message, payload, statusCode, customErrorCode } = error

                handler.response = {
                    headers: {
                        ...headers,
                        [CONTENT_TYPE]: APPLICATION_JSON
                    },
                    statusCode,
                    body: JSON.stringify({
                        payload: {
                            ...payload,
                            customErrorCode
                        },
                        message
                    }),
                    isBase64Encoded
                }
                console.log("Response -> "+JSON.stringify(handler.response.statusCode + " - " + handler.response.body));
                return next()
            }

            handler.response = {
                headers: {
                    ...headers,
                    [CONTENT_TYPE]: APPLICATION_JSON
                },
                statusCode,
                body: JSON.stringify({
                    payload,
                    message
                }),
                isBase64Encoded
            }
            console.log("Response -> "+JSON.stringify(payload));
            return next()
        } catch (err) {
            handler.response = {
                headers: {
                    ...headers,
                    [CONTENT_TYPE]: APPLICATION_JSON
                },
                statusCode: serverErrorCode,
                body: JSON.stringify({
                    payload: {},
                    message: serverErrorMessage
                }),
                isBase64Encoded
            }
            console.log("Response -> "+JSON.stringify(serverErrorCode + " - " + serverErrorMessage));
            return next()
        }
    },
    // on middleware error (e.g. validateInputs), thrown from lambda errors are caught by WithTryCatch(lambda) and returned in handler.response.error
    onError: (handler: HandlerLambda<AWSTypes.Event<Q, B, P>, ResponsesTypes.FullMiddlewareResponse>, next: NextFunction) => {
        const { headers } = handler.response
        const error = handler.error as unknown // must convert to unknown to force HandlerLambda.error type overwriting
        const lambdaError = error as HttpError

        handler.response = {
            headers: {
                ...headers,
                [CONTENT_TYPE]: APPLICATION_JSON
            },
            statusCode: lambdaError.statusCode || serverErrorCode,
            body: JSON.stringify({
                payload: lambdaError?.payload || {},
                message: lambdaError.message || serverErrorMessage
            }),
            isBase64Encoded
        }
        console.log("Response -> "+JSON.stringify(handler.response.statusCode + " - " + handler.response.body));

        return next()
    }
})
