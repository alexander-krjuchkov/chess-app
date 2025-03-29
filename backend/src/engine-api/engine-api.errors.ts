export abstract class EngineApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class InvalidApiRequestError extends EngineApiError {
    constructor() {
        super('Invalid API request');
    }
}

export class MalformedApiResponseError extends EngineApiError {
    constructor() {
        super('Malformed API response');
    }
}

export class ApiUnavailableError extends EngineApiError {
    constructor() {
        super('API unavailable');
    }
}

export class ApiUnreachableError extends EngineApiError {
    constructor() {
        super('API unreachable');
    }
}

export class NoResultApiError extends EngineApiError {
    constructor() {
        super('No result from API');
    }
}
