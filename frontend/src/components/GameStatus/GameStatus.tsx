import { observer } from 'mobx-react-lite';
import { gamesManager } from '../../stores';
import { Paper, Typography, Chip, Box } from '@mui/material';
import { ChessStatus } from '../../facades';
import styles from './GameStatus.module.css';

function getStatusDetails(status: ChessStatus) {
    if (!status.isGameOver) {
        return (
            `Turn: ${status.turn === 'white' ? 'white ⬜' : 'black ⬛'}` +
            `${status.isCheck ? ' Check! 🚨' : ''}`
        );
    }

    if (status.gameOverReason === 'checkmate') {
        return `Game over: Checkmate! ${status.winner === 'white' ? 'You win! 🎉🏆💪✨' : 'Computer wins! 🤖🏅'}`;
    }

    if (status.gameOverReason === 'draw') {
        const reasonCodeToLabelMap: { [key: string]: string } = {
            stalemate: 'by stalemate',
            'threefold-repetition': 'by threefold repetition',
            'insufficient-material': 'by insufficient material',
            '50-move-rule': 'by 50-move rule',
        };

        const reasonLabel =
            reasonCodeToLabelMap[status.drawReason ?? ''] ?? '(reason unknown)';

        return `Game over: Draw 🤝 ${reasonLabel}`;
    }

    throw new Error('Unknown game status');
}

export const GameStatus = observer(function GameStatus() {
    const game = gamesManager.currentGame;

    if (!game) {
        return <></>;
    }

    const tag = game.id.slice(0, 7);
    const date = new Date(game.createdAt).toLocaleDateString();

    const status = game.status.isGameOver ? 'Finished' : 'In progress';

    const details = getStatusDetails(game.status);

    return (
        <Paper className={styles.statusBar}>
            <Box className={styles.statusBarHeader}>
                <Chip label={tag} size='small' />
                <Typography>{date}</Typography>
            </Box>
            <Typography>{status}</Typography>
            <Box>
                <Typography variant='body2'>{details}</Typography>
            </Box>
        </Paper>
    );
});
