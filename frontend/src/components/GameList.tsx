import { observer } from 'mobx-react-lite';
import { gamesManager } from '../games-manager';
import { pendingStore } from '../pending-store';
import { PlainGame } from '../types';

function GameDescription({ game }: { game: PlainGame }) {
    const tag = game.id.slice(0, 7);
    const status = (() => {
        switch (game.status) {
            case 'in_progress':
                return '⏳';
            case 'white_wins':
                return '⚪🏆';
            case 'black_wins':
                return '⚫🏆';
            case 'draw':
                return '🤝';
        }
    })();

    return (
        <span>
            Game {tag} - {status}
        </span>
    );
}

export const GameList = observer(function GameList() {
    const { isPending } = pendingStore;

    function createGame() {
        void gamesManager.createGame();
    }

    function selectGame(gameId: string) {
        gamesManager.selectGame(gameId);
    }

    function deleteGame(gameId: string) {
        void gamesManager.deleteGame(gameId);
    }

    const gamesByDate = gamesManager.games.reduce(
        (acc, game) => {
            const date = new Date(game.createdAt).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(game);
            return acc;
        },
        {} as Record<string, PlainGame[]>,
    );

    return (
        <div>
            <h2>Your games</h2>
            <button onClick={createGame} disabled={isPending}>
                New game
            </button>
            {Object.entries(gamesByDate).map(([date, games]) => (
                <div key={date}>
                    <h3>{date}</h3>
                    <ul>
                        {games.map((game) => (
                            <li key={game.id}>
                                <GameDescription game={game} />
                                <button
                                    onClick={() => selectGame(game.id)}
                                    disabled={isPending}
                                >
                                    Select
                                </button>
                                <button
                                    onClick={() => deleteGame(game.id)}
                                    disabled={isPending}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
});
