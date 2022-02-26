const middyMiddlewareWarmup = require('middy-middleware-warmup')
import middy from "middy";
import { jsonBodyParser, doNotWaitForEmptyEventLoop, cors, httpEventNormalizer } from 'middy/middlewares';
import { proxyResponse } from './proxyResponse';
import { MIDDLEWARE_DEF_CONFIG } from './constants'
import { passthroughAll } from './passthroughAll'
import { dbConnector } from './dbConnector';
import { AWSTypes } from '../types'
import { validateInput } from './validateInputs'
import { validateJWT } from "./validateJWT";

export const combinedMiddyFactory = <Q = {}, B = {}, P = {}>(lambda: AWSTypes.LambdaLogic<Q, B, P>, validationSchema?: object, shouldConnectDB: boolean = true) =>
    middy(lambda)
    .use(middyMiddlewareWarmup())
    .use(httpEventNormalizer())
    .use(jsonBodyParser())
    .use(shouldConnectDB? dbConnector<Q, B>(): passthroughAll())
    .use(doNotWaitForEmptyEventLoop(MIDDLEWARE_DEF_CONFIG.DO_NOT_WAIT_FOR_EMPTY_EVENT_LOOP))
    .use(cors(MIDDLEWARE_DEF_CONFIG.CORS))
    .use(proxyResponse<Q, B>())
    .use(validateJWT())
    .use(validationSchema? validateInput<Q, B>(validationSchema): passthroughAll())