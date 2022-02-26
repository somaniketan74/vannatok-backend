import { Context, Callback } from 'aws-lambda'
import * as ResponsesTypes from './responses'
import { userTokenType } from "../types/user";

export type Event<Q = {}, B = {}, P = {}> = {
    headers: {
        Authorization: string
    }
    queryStringParameters: Q,
    body: B,
    pathParameters: P,
    user: userTokenType,
    resource: string,
    path: string,
    httpMethod: string
}

// tslint:disable-next-line no-any
export type LambdaLogic<Q = {}, B = {}, P = {}> = (event: Event<Q, B, P>, context?: Context, callback?: Callback) => Promise<any>
export type Handler<Q = {}, B = {}, P = {}> = (event: Event<Q, B, P>, context?: Context, callback?: Callback) => Promise<ResponsesTypes.LambdaResponse>
