import { GameProvider } from '../game-provider';
import { AccountPanel } from './AccountPanel';
import { AuthProvider } from '../auth-provider';
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
