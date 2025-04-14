type ShortGameStatus = 'in_progress' | 'white_wins' | 'black_wins' | 'draw';

export type Game = {
    id: string;
    userId: string;
    moves: string[];
    status: ShortGameStatus;
    createdAt: string;
    updatedAt: string;
};
