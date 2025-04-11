import { GameProvider } from '../game-provider';
import { AccountPanel } from './AccountPanel';
import { AuthProvider } from '../auth-provider';
import { Game } from './Game';
import { GameListProvider } from '../game-list-provider';
import { PendingProvider } from '../pending-provider';

export function App() {
    return (
        <AuthProvider>
            <PendingProvider>
                <GameListProvider>
                    <GameProvider>
                        <AccountPanel />
                        <Game />
                    </GameProvider>
                </GameListProvider>
            </PendingProvider>
        </AuthProvider>
    );
}
