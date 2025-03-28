import { GameProvider } from './GameProvider';
import { AccountPanel } from './AccountPanel';
import { AuthProvider } from './AuthProvider';
import { Game } from './Game';

export function App() {
    return (
        <AuthProvider>
            <GameProvider>
                <AccountPanel />
                <Game />
            </GameProvider>
        </AuthProvider>
    );
}
