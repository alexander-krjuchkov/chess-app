import { ReactNode } from 'react';
import { DEFAULT_POSITION, QUEEN } from 'chess.js';
import { api } from '../api';
import { GameContext } from './GameContext';
import { defaultApiErrorHandler } from '../utils/error-handler';
import { getGameStatus } from '../utils/status-utils';
import { delay } from '../utils/delay';
import { useGameListContext } from '../game-list-provider';
import { getChessValidatorForGame } from '../utils/chess-validator';
import { usePending } from '../pending-provider';

export function GameProvider({ children }: { children: ReactNode }) {
    const { games, setGames, currentGameId } = useGameListContext();
    const { isPendingRef, setPending } = usePending();

    const currentGame = games.find((g) => g.id === currentGameId) ?? null;

    const handlePieceDrop = (
        sourceSquare: string,
        targetSquare: string,
    ): boolean => {
        if (
            !currentGame ||
            currentGame.status !== 'in_progress' ||
            isPendingRef.current
        ) {
            return false;
        }

        const chess = getChessValidatorForGame(currentGame);

        try {
            chess.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: QUEEN,
            });
        } catch (e) {
            if (e instanceof Error && e.message.includes('Invalid move')) {
                return false;
            }
            throw e;
        }

        void (async () => {
            const newMoves = chess.history();
            const previousGames = [...games];

            // Optimistic update
            setGames((prev) =>
                prev.map((g) =>
                    g.id === currentGame.id ? { ...g, moves: newMoves } : g,
                ),
            );

            setPending(true);

            try {
                const updatedGame = await api.makeMove(
                    currentGame.id,
                    newMoves,
                );
                await delay(200);

                setGames((prev) =>
                    prev.map((g) =>
                        g.id === updatedGame.id ? updatedGame : g,
                    ),
                );
            } catch (error) {
                // move rollback
                setGames(previousGames);
                defaultApiErrorHandler(error);
            } finally {
                setPending(false);
            }
        })();

        return true;
    };

    const chess = currentGame ? getChessValidatorForGame(currentGame) : null;
    const fenPosition = chess?.fen() || DEFAULT_POSITION;
    const extendedGameStatus = chess ? getGameStatus(chess) : null;

    return (
        <GameContext.Provider
            value={{
                currentGame,
                fenPosition,
                extendedGameStatus,
                handlePieceDrop,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}
