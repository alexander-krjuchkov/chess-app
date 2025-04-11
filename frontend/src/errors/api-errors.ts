export abstract class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class OutOfSyncError extends ApiError {
    constructor() {
        super('Game is out of sync');
    }
}

export class GameFinishedError extends ApiError {
    constructor() {
        super('Game is already finished');
    }
}

export class GameNotFoundError extends ApiError {
    constructor() {
        super('Game not found');
    }
}

export class InvalidMoveError extends ApiError {
    constructor() {
        super('Invalid move');
    }
}

export class AuthError extends ApiError {
    constructor() {
        super('Auth error');
    }
}

export class ServerError extends ApiError {
    constructor() {
        super('Server error');
    }
}

export class UnknownApiError extends ApiError {
    constructor() {
        super('Something went wrong');
    }
}
