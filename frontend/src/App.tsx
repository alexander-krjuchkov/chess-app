import { GameProvider } from './GameProvider';
import { Board } from './Board';
import { StatusBar } from './StatusBar';

export function App() {
    return (
        <GameProvider>
            <StatusBar />
            <Board />
        </GameProvider>
    );
}
