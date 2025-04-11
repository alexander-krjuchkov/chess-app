import { useGameListContext } from '../game-list-provider';
import { usePending } from '../pending-provider';
import { Game } from '../types';

function GameDescription({ game }: { game: Game }) {
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

export function GameList() {
    const { isPendingState } = usePending();
    const { games, createGame, deleteGame, selectGame } = useGameListContext();

    const gamesByDate = games.reduce(
        (acc, game) => {
            const date = new Date(game.createdAt).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(game);
            return acc;
        },
        {} as Record<string, Game[]>,
    );

    return (
        <div>
            <h2>Your games</h2>
            <button onClick={createGame} disabled={isPendingState}>
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
                                    disabled={isPendingState}
                                >
                                    Select
                                </button>
                                <button
                                    onClick={() => deleteGame(game.id)}
                                    disabled={isPendingState}
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
}
