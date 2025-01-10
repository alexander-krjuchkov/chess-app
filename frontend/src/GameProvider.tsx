import { ReactNode, useRef, useState } from 'react';
import { Chess, DEFAULT_POSITION, QUEEN } from 'chess.js';
import { delay } from './utils';
import { getComputerMove } from './api';
import { GameContext } from './GameContext';
import { GameStatus } from './types';

function getGameStatus(game: Chess): GameStatus {
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

export function GameProvider({ children }: { children: ReactNode }) {
    const [moves, setMoves] = useState<string[]>([]);
    const [fenPosition, setFenPosition] = useState<string>(DEFAULT_POSITION);
    const gameRef = useRef(new Chess());
    const [gameStatus, setGameStatus] = useState<GameStatus>({
        isGameOver: false,
        isCheck: false,
        turn: 'white',
    });

    function makeMove(move: Parameters<Chess['move']>[0]) {
        const game = gameRef.current;
        try {
            game.move(move);
        } catch (e) {
            if (e instanceof Error && e.message.includes('Invalid move')) {
                return false;
            }
            throw e;
        }
        setMoves(game.history());
        setFenPosition(game.fen());
        setGameStatus(getGameStatus(game));
        return true;
    }

    async function makeComputerMove() {
        const game = gameRef.current;
        if (game.isGameOver()) {
            return;
        }

        await delay(200);

        const nextMove = await getComputerMove(game.history());

        if (nextMove) {
            makeMove(nextMove);
        }
    }

    function handlePieceDrop(sourceSquare: string, targetSquare: string) {
        const isValidMove = makeMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: QUEEN,
        });

        if (!isValidMove) {
            return false;
        }
        void makeComputerMove();
        return true;
    }

    return (
        <GameContext.Provider
            value={{ moves, fenPosition, gameStatus, handlePieceDrop }}
        >
            {children}
        </GameContext.Provider>
    );
}
