import { Chess } from 'chess.js';

/**
 * Extended game status
 */
export class GameStatus {
    constructor(
        public readonly isGameOver: boolean,

        public readonly turn: 'white' | 'black',
        public readonly isCheck: boolean,

        public readonly gameOverReason: 'checkmate' | 'draw' | undefined,

        public readonly winner: 'white' | 'black' | undefined,

        public readonly drawReason:
            | 'stalemate'
            | '50-move-rule'
            | 'threefold-repetition'
            | 'insufficient-material'
            | undefined,
    ) {}

    public static fromChess(chess: Chess): GameStatus {
        const isGameOver = chess.isGameOver();
        const turn = chess.turn() === 'w' ? 'white' : 'black';
        const isCheck = chess.isCheck();

        if (!chess.isGameOver()) {
            const gameOverReason = undefined;
            const winner = undefined;
            const drawReason = undefined;

            return new GameStatus(
                isGameOver,
                turn,
                isCheck,
                gameOverReason,
                winner,
                drawReason,
            );
        }

        if (chess.isCheckmate()) {
            const gameOverReason = 'checkmate';
            const winner = chess.turn() === 'w' ? 'black' : 'white';
            const drawReason = undefined;

            return new GameStatus(
                isGameOver,
                turn,
                isCheck,
                gameOverReason,
                winner,
                drawReason,
            );
        }

        if (chess.isDraw()) {
            const gameOverReason = 'draw';
            const winner = undefined;
            const drawReason = (() => {
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
            })();

            return new GameStatus(
                isGameOver,
                turn,
                isCheck,
                gameOverReason,
                winner,
                drawReason,
            );
        }

        throw new Error('Unknown game status');
    }
}
