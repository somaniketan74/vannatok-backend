import { successfulResponseWrapper, errorResponseWrapper, HttpError } from '../utils';
import { AWSTypes } from '../types'

type Execute = <Q = {}, B = {}, P = {}> (lambdaLogic: AWSTypes.LambdaLogic<Q, B, P>) => AWSTypes.Handler<Q, B, P>

export const execute: Execute = lambdaLogic => async event => {
    try {

        const result = await lambdaLogic(event)
        return successfulResponseWrapper(result)

    } catch (err) {
        if (err instanceof HttpError) {
            return errorResponseWrapper(err)
        }
        // tslint:disable-next-line no-console
        console.log('[ERROR]: Internal error', err)

        const httpError = new HttpError()

        return errorResponseWrapper(httpError)
    } finally {
        
    }
}