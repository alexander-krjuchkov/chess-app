export const gameStatusVariants = [
    'in_progress',
    'white_wins',
    'black_wins',
    'draw',
] as const;

export type GameStatus = (typeof gameStatusVariants)[number];
