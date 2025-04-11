import { Chess } from 'chess.js';
import { ExtendedGameStatus } from '../types';

export function getGameStatus(chess: Chess): ExtendedGameStatus {
    if (!chess.isGameOver()) {
        return {
            isGameOver: false,
            isCheck: chess.isCheck(),
            turn: chess.turn() === 'w' ? 'white' : 'black',
        };
    }

    if (chess.isCheckmate()) {
        return {
            isGameOver: true,
            gameOverReason: 'checkmate',
            winner: chess.turn() === 'w' ? 'black' : 'white',
        };
    }

    if (chess.isDraw()) {
        return {
            isGameOver: true,
            gameOverReason: 'draw',
            drawReason: (() => {
                switch (true) {
                    case chess.isStalemate():
                        return 'stalemate';
                    case chess.isThreefoldRepetition():
                        return 'threefold-repetition';
                    case chess.isInsufficientMaterial():
                        return 'insufficient-material';
                    default:
                        return '50-move-rule';
                }
            })(),
        };
    }

    throw new Error('Unknown game status');
}
