import { useAuth } from '../auth-provider';
import { Board } from './Board';
import { GameList } from './GameList';
import { StatusBar } from './StatusBar';

export function Game() {
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
                <StatusBar />
                <Board />
            </div>
        </div>
    );
}
