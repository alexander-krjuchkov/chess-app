import { Chess } from 'chess.js';

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
