import { useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

export function App() {
    const [, setMoves] = useState<string[]>([]);
    const gameRef = useRef(new Chess());

    function makeAMove(move: Parameters<Chess['move']>[0]) {
        const game = gameRef.current;
        try {
            game.move(move);
        } catch {
            return false;
        }
        setMoves(game.history());
        return true;
    }

    function makeRandomMove() {
        const game = gameRef.current;
        const possibleMoves = game.moves();
        if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) {
            // exit if the game is over
            return;
        }
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        makeAMove(possibleMoves[randomIndex]);
    }

    function onDrop(sourceSquare: string, targetSquare: string) {
        const moveResult = makeAMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q', // always promote to a queen for example simplicity
        });

        if (!moveResult) {
            // illegal move
            return false;
        }
        setTimeout(makeRandomMove, 200);
        return true;
    }

    return <Chessboard position={gameRef.current.fen()} onPieceDrop={onDrop} />;
}
