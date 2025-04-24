import { observer } from 'mobx-react-lite';
import { gamesManager } from '../../stores';
import { Box, Typography } from '@mui/material';
import { GameStatus } from '../GameStatus';
import { GameBoard } from '../GameBoard';
import styles from './GameArena.module.css';

export const GameArena = observer(function GameArena() {
    const game = gamesManager.currentGame;

    return (
        <Box className={styles.arena}>
            {game ? (
                <Box className={styles.game}>
                    <GameStatus />
                    <GameBoard />
                </Box>
            ) : (
                <Typography variant='h6' color='text.secondary'>
                    Select a game or create a new one
                </Typography>
            )}
        </Box>
    );
});
