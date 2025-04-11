import { Game } from '../src/game/game.entity';

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

export const jsonClone = (value: unknown) => JSON.parse(JSON.stringify(value));
