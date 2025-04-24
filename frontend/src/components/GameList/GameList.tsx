import { observer } from 'mobx-react-lite';
import { gamesManager, pendingStore } from '../../stores';
import { PlainGame } from '../../types';
import { List, Typography, Divider, Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { GameListItem } from './GameListItem';
import styles from './GameList.module.css';

export const GameList = observer(function GameList({
    onSelect = () => {},
}: {
    onSelect?: () => void;
}) {
    const { isPending } = pendingStore;

    function createGame() {
        void gamesManager.createGame();
        onSelect();
    }

    const gamesByDate = gamesManager.games.reduce(
        (acc, game) => {
            const date = new Date(game.createdAt).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(game);
            return acc;
        },
        {} as Record<string, PlainGame[]>,
    );

    return (
        <Box>
            <Box className={styles.createGameBlock}>
                <Button
                    color='inherit'
                    startIcon={<AddIcon />}
                    onClick={createGame}
                    disabled={isPending}
                    className={styles.createGameButton}
                >
                    New game
                </Button>
            </Box>
            {Object.entries(gamesByDate).map(([date, games]) => (
                <Box key={date}>
                    <Typography variant='subtitle2' className={styles.date}>
                        {date}
                    </Typography>
                    <List>
                        {games.map((game) => (
                            <GameListItem
                                key={game.id}
                                game={game}
                                onSelect={onSelect}
                            />
                        ))}
                    </List>
                    <Divider />
                </Box>
            ))}
        </Box>
    );
});
