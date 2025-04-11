import { Chess, WHITE } from 'chess.js';
import { Game } from '../src/game/game.entity';
import { GameStatus } from '../src/game/game-status';

export function isValidNextMove(history: string[], nextMove: string): boolean {
    const game = new Chess();

    for (const move of history) {
        game.move(move);
    }

    try {
        game.move(nextMove);
        return true;
    } catch (e) {
        if (e instanceof Error && e.message.includes('Invalid move')) {
            return false;
        }
        throw e;
    }
}

export function getRandomArrayElement<T>(array: T[]): T | undefined {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomString(): string {
    return Math.random().toString(36).slice(2, 7);
}

export function createGame(game: Partial<Game>): Game {
    return {
        id: getRandomString(),
        userId: getRandomString(),
        moves: [],
        status: 'in_progress',
        updatedAt: new Date(),
        createdAt: new Date(),
        ...game,
    };
}

/**
 * Example:
 * ```js
 * console.log(getGameStatus(createGame({ moves: ['f3', 'e6', 'g4', 'Qh4#'] })));
 * ```
 */
export function getGameStatus(game: Game): GameStatus {
    const chess = new Chess();
    game.moves.forEach((move) => chess.move(move));
    if (!chess.isGameOver()) {
        return 'in_progress';
    }
    if (chess.isDraw()) {
        return 'draw';
    }
    if (chess.turn() === WHITE) {
        return 'black_wins';
    }
    return 'white_wins';
}

export const jsonClone = (value: unknown) => JSON.parse(JSON.stringify(value));
