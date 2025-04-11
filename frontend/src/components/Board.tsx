import { Chessboard } from 'react-chessboard';
import { useGameContext } from '../game-provider';
import { useGameListContext } from '../game-list-provider';
import { usePending } from '../pending-provider';

export function Board() {
    const { isPendingState } = usePending();
    const { selectGame } = useGameListContext();
    const { currentGame, handlePieceDrop, fenPosition } = useGameContext();

    if (!currentGame) {
        return <div>Select a game</div>;
    }

    return (
        <div style={{ maxWidth: '560px' }}>
            <div style={{ marginBottom: '1rem' }}>
                <button
                    onClick={() => selectGame(null)}
                    disabled={isPendingState}
                >
                    Close game
                </button>
            </div>
            <Chessboard
                position={fenPosition}
                onPieceDrop={handlePieceDrop}
                arePiecesDraggable={
                    currentGame.status === 'in_progress' && !isPendingState
                }
                autoPromoteToQueen={true}
            />
        </div>
    );
}
