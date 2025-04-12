import { useAuth } from '../auth-provider';
import { GameBoard } from './GameBoard';
import { GameList } from './GameList';
import { GameStatusBar } from './GameStatusBar';

export function AuthProtected() {
    const { user } = useAuth();

    if (!user) {
        return <>Please sign in to continue</>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <div style={{ flex: 'none' }}>
                <GameList />
            </div>
            <div style={{ flex: 'auto' }}>
                <GameStatusBar />
                <GameBoard />
            </div>
        </div>
    );
}
