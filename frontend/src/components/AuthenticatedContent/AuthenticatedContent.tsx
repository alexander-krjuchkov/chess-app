import { useState } from 'react';
import { Box, Drawer, IconButton } from '@mui/material';
import {
    History as HistoryIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { GameList } from '../GameList';
import { useIsMobile } from '../../hooks/useIsMobile';
import { GameArena } from '../GameArena';
import styles from './AuthenticatedContent.module.css';

export function AuthenticatedContent() {
    const isMobile = useIsMobile();
    const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);

    const handleDrawerOpen = () => setIsDrawerOpen(true);
    const handleDrawerClose = () => setIsDrawerOpen(false);

    return (
        <Box className={styles.container}>
            {!isMobile && (
                <Drawer
                    variant='persistent'
                    open={isDrawerOpen}
                    className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ''}`}
                >
                    <Box className={styles.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <GameList />
                </Drawer>
            )}

            <GameArena />

            {!isMobile && !isDrawerOpen && (
                <IconButton
                    onClick={handleDrawerOpen}
                    className={styles.openButton}
                >
                    <HistoryIcon />
                </IconButton>
            )}
        </Box>
    );
}
