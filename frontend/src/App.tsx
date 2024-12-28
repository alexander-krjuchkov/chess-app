import { useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, QUEEN } from 'chess.js';
import { delay } from './utils';

export function App() {
    const [, setMoves] = useState<string[]>([]);
    const gameRef = useRef(new Chess());

    function makeAMove(move: Parameters<Chess['move']>[0]) {
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
        return true;
    }

    async function makeComputerMove() {
        const game = gameRef.current;
        if (game.isGameOver()) {
            return;
        }

        await delay(200);

        const possibleMoves = game.moves();
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        const randomMove = possibleMoves[randomIndex];
        makeAMove(randomMove);
    }

    function onDrop(sourceSquare: string, targetSquare: string) {
        const isValidMove = makeAMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: QUEEN,
        });

        if (!isValidMove) {
            return false;
        }
        makeComputerMove();
        return true;
    }

    return (
        <Chessboard
            position={gameRef.current.fen()}
            onPieceDrop={onDrop}
            autoPromoteToQueen={true}
        />
    );
}
