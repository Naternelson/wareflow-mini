import { ErrorCodes } from "./error";

export class ApiError extends Error {
    code: ErrorCodes
    details?: any
    constructor(message:string, code: ErrorCodes, details?: any) {
        super(message);
        this.code = code;
        this.details = details;
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.BAD_REQUEST, details);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.UNAUTHORIZED, details);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.FORBIDDEN, details);
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.NOT_FOUND, details);
    }
}

export class MethodNotAllowedError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.METHOD_NOT_ALLOWED, details);
    }
}

export class NotAcceptableError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.NOT_ACCEPTABLE, details);
    }
}

export class ProxyAuthenticationRequiredError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.PROXY_AUTHENTICATION_REQUIRED, details);
    }
}

export class ConflictError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.CONFLICT, details);
    }
}

export class GoneError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.GONE, details);
    }
}

export class PreconditionFailedError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.PRECONDITION_FAILED, details);
    }
}

export class UnprocessableEntityError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.UNPROCESSABLE_ENTITY, details);
    }
}

export class TooManyRequestsError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.TOO_MANY_REQUESTS, details);
    }
}

export class TokenExpiredError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.TOKEN_EXPIRED, details);
    }
}

export class InternalServerError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.INTERNAL_SERVER_ERROR, details);
    }
}

export class BadGatewayError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.BAD_GATEWAY, details);
    }
}

export class ServiceUnavailableError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.SERVICE_UNAVAILABLE, details);
    }
}

export class GatewayTimeoutError extends ApiError {
    constructor(message: string, details?: any) {
        super(message, ErrorCodes.GATEWAY_TIMEOUT, details);
    }
}