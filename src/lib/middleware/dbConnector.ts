import mongoose from "mongoose";
import { dbOpts } from "../config/mongoDBConfig";
import { NextFunction, HandlerLambda } from 'middy'
import { AWSTypes, ResponsesTypes } from '../types'

export const dbConnector = <Q = {}, B = {}, P = {}>() => ({
    before: async (handler: HandlerLambda<AWSTypes.Event<Q, B, P>, ResponsesTypes.FullMiddlewareResponse>, next: NextFunction) => {
        if (mongoose.connection.readyState === 1) {
        } else {
            await mongoose.connect(dbOpts.databaseURI, dbOpts.connectionOpts);
        }
        return;
    },
    after: async (handler: HandlerLambda<AWSTypes.Event<Q, B, P>, ResponsesTypes.FullMiddlewareResponse>, next: NextFunction) => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        return;
    }
})