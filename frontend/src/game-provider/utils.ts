import { Chess } from 'chess.js';
import { GameStatus } from '../types';

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function getGameStatus(game: Chess): GameStatus {
    if (!game.isGameOver()) {
        return {
            isGameOver: false,
            isCheck: game.isCheck(),
            turn: game.turn() === 'w' ? 'white' : 'black',
        };
    }

    if (game.isCheckmate()) {
        return {
            isGameOver: true,
            gameOverReason: 'checkmate',
            winner: game.turn() === 'w' ? 'black' : 'white',
        };
    }

    if (game.isDraw()) {
        return {
            isGameOver: true,
            gameOverReason: 'draw',
            drawReason: (() => {
                switch (true) {
                    case game.isStalemate():
                        return 'stalemate';
                    case game.isThreefoldRepetition():
                        return 'threefold-repetition';
                    case game.isInsufficientMaterial():
                        return 'insufficient-material';
                    default:
                        return '50-move-rule';
                }
            })(),
        };
    }

    throw new Error('Unknown game status');
}
