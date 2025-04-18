import { ShortGameStatus } from './ShortGameStatus';

export type PlainGame = {
    id: string;
    userId: string;
    moves: string[];
    status: ShortGameStatus;
    createdAt: string;
    updatedAt: string;
};
