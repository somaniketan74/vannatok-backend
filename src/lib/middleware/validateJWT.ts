import joi from 'joi'
import { NextFunction, HandlerLambda } from 'middy'
import { HttpError, R, HttpPathAuthNotRequire, jwtHelper, HttpPathAdminRequire, USER_STATUS_MESSAGE } from '../utils'
import { AWSTypes, ResponsesTypes } from '../types'

export const validateJWT = <Q = {}, B = {}, P = {}> () => ({
    before: async (handler: HandlerLambda<AWSTypes.Event<Q, B, P>, ResponsesTypes.LambdaResponse>, next: NextFunction) => {
        const { headers } = handler.event
        if (headers.Authorization) {
            try {
                handler.event.user = await jwtHelper.verifyToken(headers.Authorization);
            } catch(err) {
                throw new HttpError().Unauthorized();               
            }
        }
        let AdminpathObj = HttpPathAdminRequire[handler.event.path] || HttpPathAdminRequire[handler.event.resource];
        let AdminauthRequire = (AdminpathObj?.method?.indexOf(handler.event.httpMethod)>-1);
        if (AdminauthRequire) {
            if (!headers.Authorization) throw new HttpError().Unauthorized();
            if (handler.event.user.role == "Admin") {
                return;
            } else {
                throw new HttpError().Unauthorized();
            }
        }

        let pathObj = HttpPathAuthNotRequire[handler.event.path] || HttpPathAuthNotRequire[handler.event.resource];
        let authRequire = !(pathObj?.method?.indexOf(handler.event.httpMethod)>-1);
        if (authRequire) {
            if (!headers.Authorization) throw new HttpError().Unauthorized();
            if(handler.event.user.status !== "Active" && handler.event.user.status !== "Pending"){
                throw new HttpError().Unauthorized(USER_STATUS_MESSAGE[handler.event.user.status]);
            }
        }
        if(handler.event.user){
            console.log("LoggedIn User -> "+ JSON.stringify(handler.event.user));
        }
        return;
    },
    onError: (_: HandlerLambda, next: NextFunction) => {
        return next()
    }
})
