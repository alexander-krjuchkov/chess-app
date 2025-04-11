import { useGameContext } from '../game-provider';
import { ExtendedGameStatus } from '../types';

function StatusInfo({ status }: { status: ExtendedGameStatus }) {
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
    const { extendedGameStatus } = useGameContext();

    if (!extendedGameStatus) {
        return <></>;
    }

    return (
        <div>
            <StatusInfo status={extendedGameStatus} />
        </div>
    );
}
