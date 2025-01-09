import { useGameContext } from './GameContext';
import { GameStatus } from './types';

function StatusInfo({ status }: { status: GameStatus }) {
    if (!status.isGameOver) {
        return `Turn: ${status.turn} ${status.turn === 'white' ? '⬜' : '⬛'}${status.isCheck ? ' (Check 🚨)' : ''}`;
    }

    if (status.gameOverReason === 'checkmate') {
        return `Game Over: Checkmate! ${status.winner === 'white' ? 'You win! 🎉🏆💪✨' : 'Computer wins! 🤖🏅'}`;
    }

    if (status.gameOverReason === 'draw') {
        const reasonCodeToLabelMap: { [key: string]: string } = {
            stalemate: 'stalemate',
            'threefold-repetition': 'threefold repetition',
            'insufficient-material': 'insufficient material',
            '50-move-rule': '50-move rule',
        };

        const reasonLabel =
            reasonCodeToLabelMap[status.drawReason] ?? 'unknown reason';

        return `Game Over: Draw🤝 due to ${reasonLabel}`;
    }

    throw new Error('Unknown game status');
}

export function StatusBar() {
    const { gameStatus } = useGameContext();

    return (
        <div>
            <StatusInfo status={gameStatus} />
        </div>
    );
}
