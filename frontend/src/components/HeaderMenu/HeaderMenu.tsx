import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
    Add as AddIcon,
    Close as CloseIcon,
    Logout as LogoutIcon,
    History as HistoryIcon,
} from '@mui/icons-material';
import { authManager, gamesManager, pendingStore } from '../../stores';
import { GameList } from '../GameList';
import { HeaderButton } from '../HeaderButton';
import { useIsMobile } from '../../hooks/useIsMobile';
import { Modal } from '../Modal';

export const HeaderMenu = observer(function HeaderMenu() {
    const user = authManager.user;
    const game = gamesManager.currentGame;
    const { isPending } = pendingStore;

    const isMobile = useIsMobile();
    const [isListOpen, setIsListOpen] = useState(false);

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

    const listModal = user && isMobile && (
        <Modal open={isListOpen} onClose={handleCloseList} title='Your games'>
            <GameList onSelect={handleCloseList} />
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
        </div>
    );
});
