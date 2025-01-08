import { Chessboard } from 'react-chessboard';
import { useGameContext } from './GameContext';

export function Board() {
    const { fenPosition, handlePieceDrop } = useGameContext();

    return (
        <div style={{ maxWidth: '560px' }}>
            <Chessboard
                position={fenPosition}
                onPieceDrop={handlePieceDrop}
                autoPromoteToQueen={true}
            />
        </div>
    );
}
