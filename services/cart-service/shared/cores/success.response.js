const {
    ReasonPhrases,
    StatusCodes,
} = require("../utils/httpStatusCodes");

class SuccessResponse {
    constructor(message, status, data = null) {
        this.message = message;
        this.status = status;
        this.metadata = data;
    }
    send(res, headers={}){
        return res.status(this.status).json(this)
    }
}

class OkResponse extends SuccessResponse {
    constructor(data = null, message = ReasonPhrases.OK, status = StatusCodes.OK) {
        super(message, status, data);
    }
}

class CreatedResponse extends SuccessResponse {
    constructor(data = null, message = ReasonPhrases.CREATED, status = StatusCodes.CREATED) {
        super(message, status, data);
    }
}

class AcceptedResponse extends SuccessResponse {
    constructor(data = null, message = ReasonPhrases.ACCEPTED, status = StatusCodes.ACCEPTED) {
        super(message, status, data);
    }
}

class NonAuthoritativeInformationResponse extends SuccessResponse {
    constructor(data = null, message = ReasonPhrases.NON_AUTHORITATIVE_INFORMATION, status = StatusCodes.NON_AUTHORITATIVE_INFORMATION) {
        super(message, status, data);
    }
}

class NoContentResponse extends SuccessResponse {
    constructor(message = ReasonPhrases.NO_CONTENT, status = StatusCodes.NO_CONTENT) {
        super(message, status, null);
    }
}

class ResetContentResponse extends SuccessResponse {
    constructor(message = ReasonPhrases.RESET_CONTENT, status = StatusCodes.RESET_CONTENT) {
        super(message, status, null);
    }
}

class PartialContentResponse extends SuccessResponse {
    constructor(data = null, message = ReasonPhrases.PARTIAL_CONTENT, status = StatusCodes.PARTIAL_CONTENT) {
        super(message, status, data);
    }
}

module.exports = {
    OkResponse,
    CreatedResponse,
    AcceptedResponse,
    NonAuthoritativeInformationResponse,
    NoContentResponse,
    ResetContentResponse,
    PartialContentResponse,
    SuccessResponse
};
