import { combinedMiddyFactory } from '../middleware'
import { execute } from '../hof'
import { AWSTypes } from '../types'

export const handlerWrapper = <Q = {}, B = {}, P = {}>(lambda: AWSTypes.LambdaLogic<Q, B, P>, validationSchema?: object, shouldConnectDB: boolean = true) =>
    combinedMiddyFactory<Q, B, P>(execute(lambda), validationSchema, shouldConnectDB)