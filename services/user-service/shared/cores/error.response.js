const {
    ReasonPhrases,
    StatusCodes,
} = require("../utils/httpStatusCodes");

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
    send(res, headers={}){
        return res.status(this.status).json(this)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_REQUEST, status = StatusCodes.BAD_REQUEST) {
        super(message, status);
    }
}

class UnauthorizedError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {
        super(message, status);
    }
}

class PaymentRequiredError extends ErrorResponse {
    constructor(message = ReasonPhrases.PAYMENT_REQUIRED, status = StatusCodes.PAYMENT_REQUIRED) {
        super(message, status);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
        super(message, status);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, status = StatusCodes.NOT_FOUND) {
        super(message, status);
    }
}

class MethodNotAllowedError extends ErrorResponse {
    constructor(message = ReasonPhrases.METHOD_NOT_ALLOWED, status = StatusCodes.METHOD_NOT_ALLOWED) {
        super(message, status);
    }
}

class ConflictError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
        super(message, status);
    }
}

class UnprocessableEntityError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNPROCESSABLE_ENTITY, status = StatusCodes.UNPROCESSABLE_ENTITY) {
        super(message, status);
    }
}

class TooManyRequestsError extends ErrorResponse {
    constructor(message = ReasonPhrases.TOO_MANY_REQUESTS, status = StatusCodes.TOO_MANY_REQUESTS) {
        super(message, status);
    }
}

class InternalServerError extends ErrorResponse {
    constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR, status = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message, status);
    }
}

class NotImplementedError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_IMPLEMENTED, status = StatusCodes.NOT_IMPLEMENTED) {
        super(message, status);
    }
}

class BadGatewayError extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_GATEWAY, status = StatusCodes.BAD_GATEWAY) {
        super(message, status);
    }
}

class ServiceUnavailableError extends ErrorResponse {
    constructor(message = ReasonPhrases.SERVICE_UNAVAILABLE, status = StatusCodes.SERVICE_UNAVAILABLE) {
        super(message, status);
    }
}

module.exports = {
    BadRequestError,
    UnauthorizedError,
    PaymentRequiredError,
    ForbiddenError,
    NotFoundError,
    MethodNotAllowedError,
    ConflictError,
    UnprocessableEntityError,
    TooManyRequestsError,
    InternalServerError,
    NotImplementedError,
    BadGatewayError,
    ServiceUnavailableError,
};
