import { GameProvider } from './GameProvider';
import { Board } from './Board';

export function App() {
    return (
        <GameProvider>
            <Board />
        </GameProvider>
    );
}
