import { ReactNode, useRef, useState } from 'react';
import { Chess, DEFAULT_POSITION, QUEEN } from 'chess.js';
import { delay, getGameStatus } from './utils';
import { getComputerMove } from '../api';
import { GameContext } from './GameContext';
import { GameStatus } from '../types';

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
