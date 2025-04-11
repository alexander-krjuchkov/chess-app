abstract class GameError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class InvalidMoveError extends GameError {
    constructor() {
        super('Invalid move sequence');
    }
}

export class GameNotFoundError extends GameError {
    constructor() {
        super('Game not found');
    }
}

export class GameAccessDeniedError extends GameError {
    constructor() {
        super('Game access denied');
    }
}

export class OutOfSyncError extends GameError {
    constructor() {
        super('Game state is out of sync');
    }
}

export class GameFinishedError extends GameError {
    constructor() {
        super('Game is already finished');
    }
}
