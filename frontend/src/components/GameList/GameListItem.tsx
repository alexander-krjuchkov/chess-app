import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { gamesManager, pendingStore } from '../../stores';
import { PlainGame } from '../../types';
import {
    ListItem,
    ListItemText,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Box,
    Chip,
    ListItemButton,
    ListItemIcon,
} from '@mui/material';
import {
    MoreHoriz as MoreHorizIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { getGameOpeningLabel } from '../../utils/opening-label';
import styles from './GameListItem.module.css';

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

export const GameListItem = observer(function GameListItem({
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

    const selectedGame = gamesManager.currentGame;
    const isSelected = !!selectedGame && selectedGame.id === game.id;

    return (
        <ListItem
            secondaryAction={
                <IconButton onClick={handleMenuOpen} disabled={isPending}>
                    <MoreHorizIcon />
                </IconButton>
            }
            disablePadding
        >
            <ListItemButton
                onClick={handleSelect}
                disabled={isPending}
                className={isSelected ? styles.gameSelected : ''}
            >
                <GameListItemDescription game={game} />
            </ListItemButton>

            {menu}
        </ListItem>
    );
});
