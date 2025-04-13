import { observer } from 'mobx-react-lite';
import { Chessboard } from 'react-chessboard';
import { gamesManager } from '../games-manager';
import { pendingStore } from '../pending-store';

export const GameBoard = observer(function GameBoard() {
    const { isPending } = pendingStore;

    const currentGame = gamesManager.currentGame;

    if (!currentGame) {
        return <div>Select a game</div>;
    }

    const fenPosition = gamesManager.fenPosition;
    const isBoardInteractive =
        !isPending && currentGame.status === 'in_progress';

    function closeGame() {
        gamesManager.selectGame(null);
    }

    function handlePieceDrop(
        sourceSquare: string,
        targetSquare: string,
    ): boolean {
        return gamesManager.handlePieceDrop(sourceSquare, targetSquare);
    }

    return (
        <div style={{ maxWidth: '560px' }}>
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={closeGame} disabled={isPending}>
                    Close game
                </button>
            </div>
            <Chessboard
                position={fenPosition}
                onPieceDrop={handlePieceDrop}
                arePiecesDraggable={isBoardInteractive}
                autoPromoteToQueen={true}
            />
        </div>
    );
});
