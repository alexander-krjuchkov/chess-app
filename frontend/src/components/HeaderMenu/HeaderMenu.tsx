import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Typography } from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    Logout as LogoutIcon,
    History as HistoryIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { authManager, gamesManager, pendingStore } from '../../stores';
import { GameList } from '../GameList';
import { HeaderButton } from '../HeaderButton';
import { useIsMobile } from '../../hooks/useIsMobile';
import { Modal } from '../Modal';
import styles from './HeaderMenu.module.css';

export const HeaderMenu = observer(function HeaderMenu() {
    const user = authManager.user;
    const game = gamesManager.currentGame;
    const { isPending } = pendingStore;

    const isMobile = useIsMobile();
    const [isListOpen, setIsListOpen] = useState(false);
    const [isPgnOpen, setIsPgnOpen] = useState(false);

    const handleLogout = () => {
        void authManager.signOutRedirect();
    };

    const handleCreateGame = () => {
        void gamesManager.createGame();
    };

    const handleCloseGame = () => {
        gamesManager.selectGame(null);
    };

    const handleOpenList = () => {
        setIsListOpen(true);
    };

    const handleCloseList = () => {
        setIsListOpen(false);
    };

    const handleOpenPgn = () => {
        setIsPgnOpen(true);
    };

    const handleClosePgn = () => {
        setIsPgnOpen(false);
    };

    const listModal = user && isMobile && (
        <Modal open={isListOpen} onClose={handleCloseList} title='Your games'>
            <GameList onSelect={handleCloseList} />
        </Modal>
    );

    const pgnModal = user && game && (
        <Modal open={isPgnOpen} onClose={handleClosePgn} title='Game PGN'>
            <Box className={styles.pgnContainer}>
                <Typography className={styles.pgnText}>
                    {game.pgn || 'No PGN available'}
                </Typography>
            </Box>
        </Modal>
    );

    return (
        <div>
            {user && isMobile && (
                <HeaderButton
                    icon={<HistoryIcon />}
                    text='Game list'
                    onClick={handleOpenList}
                    disabled={isPending}
                />
            )}
            {user && game && (
                <HeaderButton
                    icon={<CloseIcon />}
                    text='Close game'
                    onClick={handleCloseGame}
                    disabled={isPending}
                />
            )}
            {user && game && (
                <HeaderButton
                    icon={<VisibilityIcon />}
                    text='Show PGN'
                    onClick={handleOpenPgn}
                    disabled={isPending}
                />
            )}
            {user && (
                <HeaderButton
                    icon={<AddIcon />}
                    text='New game'
                    onClick={handleCreateGame}
                    disabled={isPending}
                />
            )}
            {user && (
                <HeaderButton
                    icon={<LogoutIcon />}
                    text='Sign out'
                    onClick={handleLogout}
                    disabled={false}
                />
            )}

            {listModal}
            {pgnModal}
        </div>
    );
});
