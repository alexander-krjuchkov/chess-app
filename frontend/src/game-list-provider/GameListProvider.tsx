import { ReactNode, useEffect, useState } from 'react';
import { Game } from '../types';
import {
    getGames as apiGetGames,
    createGame as apiCreateGame,
    deleteGame as apiDeleteGame,
} from '../api';
import { useAuth } from '../auth-provider';
import { defaultApiErrorHandler } from '../utils/error-handler';
import { GameListContext } from './GameListContext';
import { usePending } from '../pending-provider';

export function GameListProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [games, setGames] = useState<Game[]>([]);
    const [currentGameId, setCurrentGameId] = useState<string | null>(null);
    const { isPendingRef, setPending } = usePending();

    const executeRequest = (
        operation: () => Promise<void>,
        errorHandler: (error: unknown) => void,
    ): void => {
        void (async () => {
            try {
                if (isPendingRef.current) {
                    return;
                }
                setPending(true);

                await operation();
            } catch (error) {
                errorHandler(error);
            } finally {
                setPending(false);
            }
        })();
    };

    const loadGames = () =>
        executeRequest(
            async () => {
                const fetchedGames = await apiGetGames();
                setGames(fetchedGames);

                const lastUnfinished = fetchedGames.find(
                    (g) => g.status === 'in_progress',
                );
                if (lastUnfinished) {
                    setCurrentGameId(lastUnfinished.id);
                }
            },
            (error) => {
                defaultApiErrorHandler(error);
            },
        );

    const createGame = () =>
        executeRequest(
            async () => {
                const newGame = await apiCreateGame();
                setGames((prev) => [newGame, ...prev]);
                setCurrentGameId(newGame.id);
            },
            (error) => {
                defaultApiErrorHandler(error);
            },
        );

    const deleteGame = (id: string) =>
        executeRequest(
            async () => {
                await apiDeleteGame(id);
                setGames((prev) => prev.filter((g) => g.id !== id));
                setCurrentGameId((prev) => (prev === id ? null : prev));
            },
            (error) => {
                defaultApiErrorHandler(error);
            },
        );

    const selectGame = (id: string | null) => {
        if (isPendingRef.current) {
            return;
        }
        if (id === null) {
            setCurrentGameId(null);
        }
        const idExists = games.some((g) => g.id === id);
        setCurrentGameId(idExists ? id : null);
    };

    const userId = user?.profile.sub;
    useEffect(() => {
        if (userId) {
            void loadGames();
        }
    }, [userId]);

    return (
        <GameListContext.Provider
            value={{
                games,
                currentGameId,
                setGames,
                createGame,
                deleteGame,
                selectGame,
            }}
        >
            {children}
        </GameListContext.Provider>
    );
}
