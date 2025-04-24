import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { gamesManager, pendingStore } from '../stores';
import { PlainGame } from '../types';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Divider,
    Box,
    Chip,
    ListItemButton,
    ListItemIcon,
    Button,
} from '@mui/material';
import {
    Add as AddIcon,
    MoreHoriz as MoreHorizIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { getGameOpeningLabel } from '../utils/opening-label';
import styles from './GameList.module.css';

const GameListItemDescription = observer(function GameListItemDescription({
    game,
}: {
    game: PlainGame;
}) {
    const tag = game.id.slice(0, 7);
    const status = (() => {
        switch (game.status) {
            case 'in_progress':
                return '⏳';
            case 'white_wins':
                return '⚪🏆';
            case 'black_wins':
                return '⚫🏆';
            case 'draw':
                return '🤝';
        }
    })();

    const openingMovesLabel = getGameOpeningLabel(game);

    const header = (
        <Box className={styles.gameDescriptionHeader}>
            <Chip label={tag} size='small' />
            <Typography>{status}</Typography>
        </Box>
    );

    return (
        <ListItemText
            primary={header}
            secondary={openingMovesLabel}
            className={styles.gameDescription}
            slotProps={{
                secondary: {
                    className: styles.gameDescriptionFooter,
                },
            }}
        />
    );
});

const GameListItem = observer(function GameListItem({
    game,
    onSelect,
}: {
    game: PlainGame;
    onSelect: () => void;
}) {
    const { isPending } = pendingStore;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        void gamesManager.deleteGame(game.id);
        handleMenuClose();
    };

    const handleSelect = () => {
        gamesManager.selectGame(game.id);
        onSelect();
    };

    const menu = (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleDelete} disabled={isPending}>
                <ListItemIcon>
                    <DeleteIcon />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
            </MenuItem>
        </Menu>
    );

    return (
        <ListItem
            secondaryAction={
                <IconButton onClick={handleMenuOpen} disabled={isPending}>
                    <MoreHorizIcon />
                </IconButton>
            }
            disablePadding
        >
            <ListItemButton onClick={handleSelect} disabled={isPending}>
                <GameListItemDescription game={game} />
            </ListItemButton>

            {menu}
        </ListItem>
    );
});

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
