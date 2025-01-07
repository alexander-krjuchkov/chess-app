import { Chessboard } from 'react-chessboard';
import { useGameContext } from './GameContext';

export function Board() {
    const { fen, onDrop } = useGameContext();

    return (
        <div style={{ maxWidth: '560px' }}>
            <Chessboard
                position={fen}
                onPieceDrop={onDrop}
                autoPromoteToQueen={true}
            />
        </div>
    );
}
