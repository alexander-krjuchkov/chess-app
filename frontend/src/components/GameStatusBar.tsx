import { observer } from 'mobx-react-lite';
import { gamesManager } from '../games-manager';
import { GameStatus } from '../GameStatus';

function StatusView({ status }: { status: GameStatus }) {
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
            reasonCodeToLabelMap[status.drawReason ?? ''] ?? 'unknown reason';

        return `Game Over: Draw🤝 due to ${reasonLabel}`;
    }

    throw new Error('Unknown game status');
}

export const GameStatusBar = observer(function GameStatusBar() {
    const game = gamesManager.currentGame;

    if (!game) {
        return <></>;
    }

    return (
        <div>
            <StatusView status={game.status} />
        </div>
    );
});
