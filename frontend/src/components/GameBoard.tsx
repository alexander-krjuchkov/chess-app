import { observer } from 'mobx-react-lite';
import { Chessboard } from 'react-chessboard';
import { gamesManager, pendingStore } from '../stores';
import { Box } from '@mui/material';
import styles from './GameBoard.module.css';

export const GameBoard = observer(function GameBoard() {
    const { isPending } = pendingStore;
    const game = gamesManager.currentGame;

    if (!game) {
        return <>No game selected</>;
    }

    const fenPosition = game.fenPosition;
    const isBoardInteractive = !isPending && !game.status.isGameOver;

    function handlePieceDrop(
        sourceSquare: string,
        targetSquare: string,
    ): boolean {
        return gamesManager.handlePieceDrop(sourceSquare, targetSquare);
    }

    return (
        <Box className={styles.board}>
            <Chessboard
                position={fenPosition}
                onPieceDrop={handlePieceDrop}
                arePiecesDraggable={isBoardInteractive}
                autoPromoteToQueen={true}
            />
        </Box>
    );
});
