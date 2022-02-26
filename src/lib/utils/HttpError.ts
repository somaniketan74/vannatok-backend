import httpStatusCodes, { getStatusText } from 'http-status-codes'
import { CustomErrorCodes } from '../types/CustomErrorCodes';

export class HttpError {
    public statusCode: number
    public message: string
    public payload: {}
    public customErrorCode?: CustomErrorCodes

    constructor() {
        this.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR
        this.message = getStatusText(this.statusCode)
        this.payload = {}
    }

    public BadRequest(customMessage?: string, customErrorCode?: CustomErrorCodes, payload: {} = {}) {
        return this.createError(httpStatusCodes.BAD_REQUEST, customMessage, customErrorCode, payload)
    }

    public Unauthorized(customMessage?: string, customErrorCode?: CustomErrorCodes, payload: {} = {}) {
        return this.createError(httpStatusCodes.UNAUTHORIZED, customMessage, customErrorCode, payload)
    }

    public Forbidden(customMessage?: string, customErrorCode?: CustomErrorCodes, payload: {} = {}) {
        return this.createError(httpStatusCodes.FORBIDDEN, customMessage, customErrorCode, payload)
    }

    public NotFound(customMessage?: string, customErrorCode?: CustomErrorCodes, payload: {} = {}) {
        return this.createError(httpStatusCodes.NOT_FOUND, customMessage, customErrorCode, payload)
    }

    public MethodNotAllowed(customMessage?: string, customErrorCode?: CustomErrorCodes, payload: {} = {}) {
        return this.createError(httpStatusCodes.METHOD_NOT_ALLOWED, customMessage, customErrorCode, payload)
    }

    public NotAcceptable(customMessage?: string, customErrorCode?: CustomErrorCodes, payload: {} = {}) {
        return this.createError(httpStatusCodes.NOT_ACCEPTABLE, customMessage, customErrorCode, payload)
    }

    public RequestTimeout(customMessage?: string, customErrorCode?: CustomErrorCodes, payload: {} = {}) {
        return this.createError(httpStatusCodes.REQUEST_TIMEOUT, customMessage, customErrorCode, payload)
    }

    public Conflict(customMessage?: string, customErrorCode?: CustomErrorCodes, payload: {} = {}) {
        return this.createError(httpStatusCodes.CONFLICT, customMessage, customErrorCode, payload)
    }

    public Gone(customMessage?: string, customErrorCode?: CustomErrorCodes, payload: {} = {}) {
        return this.createError(httpStatusCodes.GONE, customMessage, customErrorCode, payload)
    }

    public TooManyRequests(customMessage?: string, customErrorCode?: CustomErrorCodes, payload: {} = {}) {
        return this.createError(httpStatusCodes.TOO_MANY_REQUESTS, customMessage, customErrorCode, payload)
    }

    public InternalServerError(customMessage?: string, customErrorCode?: CustomErrorCodes, payload: {} = {}) {
        return this.createError(httpStatusCodes.INTERNAL_SERVER_ERROR, customMessage, customErrorCode, payload)
    }

    private createError(statusCode: number, message?: string, customErrorCode?: CustomErrorCodes, payload: {} = {}) {
        this.statusCode = statusCode
        this.message = message || getStatusText(statusCode)
        this.payload = payload
        this.customErrorCode = customErrorCode

        return this
    }
}