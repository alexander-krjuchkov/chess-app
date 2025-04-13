import { makeAutoObservable, reaction } from 'mobx';
import { Game } from './types';
import { api } from './api';
import { defaultApiErrorHandler } from './utils/error-handler';
import { DEFAULT_POSITION, QUEEN } from 'chess.js';
import { getGameStatus } from './utils/status-utils';
import { delay } from './utils/delay';
import { getChessValidatorForGame } from './utils/chess-validator';
import { authManager, AuthManager } from './auth-manager';
import { pendingStore, PendingStore } from './pending-store';

class GamesManager {
    private _games: Game[] = [];
    private _currentGameId: string | null = null;

    constructor(
        private authManager: AuthManager,
        private pendingStore: PendingStore,
    ) {
        makeAutoObservable(this);

        reaction(
            () => this.authManager.user?.id,
            (userId) => {
                if (userId) {
                    void this.loadGames();
                }
            },
            { fireImmediately: true },
        );
    }

    private get isPending() {
        return this.pendingStore.isPending;
    }

    private set isPending(value: boolean) {
        this.pendingStore.isPending = value;
    }

    private set games(games: Game[]) {
        // This setter is a MobX action to handle property changes correctly.
        this._games = games;
    }

    get games() {
        return this._games;
    }

    private set currentGameId(id: string | null) {
        // This setter is a MobX action to handle property changes correctly.
        this._currentGameId = id;
    }

    private get currentGameId() {
        return this._currentGameId;
    }

    private async loadGames() {
        if (this.isPending) {
            return;
        }
        this.isPending = true;
        try {
            const fetchedGames = await api.getGames();
            this.games = fetchedGames;

            const lastUnfinished = fetchedGames.find(
                (g) => g.status === 'in_progress',
            );
            if (lastUnfinished) {
                this.currentGameId = lastUnfinished.id;
            }
        } catch (error) {
            defaultApiErrorHandler(error);
        } finally {
            this.isPending = false;
        }
    }

    async createGame() {
        if (this.isPending) {
            return;
        }
        this.isPending = true;
        try {
            const newGame = await api.createGame();
            this.games = [newGame, ...this.games];
            this.currentGameId = newGame.id;
        } catch (error) {
            defaultApiErrorHandler(error);
        } finally {
            this.isPending = false;
        }
    }

    async deleteGame(id: string) {
        if (this.isPending) {
            return;
        }
        this.isPending = true;
        try {
            await api.deleteGame(id);
            this.games = this.games.filter((g) => g.id !== id);
            if (this.currentGameId === id) {
                this.currentGameId = null;
            }
        } catch (error) {
            defaultApiErrorHandler(error);
        } finally {
            this.isPending = false;
        }
    }

    selectGame(id: string | null) {
        if (this.isPending) {
            return;
        }
        if (id === null) {
            this.currentGameId = null;
        } else {
            const idExists = this.games.some((g) => g.id === id);
            this.currentGameId = idExists ? id : null;
        }
    }

    handlePieceDrop(sourceSquare: string, targetSquare: string): boolean {
        if (
            !this.currentGame ||
            this.currentGame.status !== 'in_progress' ||
            this.isPending
        ) {
            return false;
        }

        const chess = getChessValidatorForGame(this.currentGame);
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

        const gameId = this.currentGame.id;
        const newMoves = chess.history();
        const previousGames = [...this.games];

        void (async () => {
            // Optimistic update
            this.games = this.games.map((g) =>
                g.id === gameId ? { ...g, moves: newMoves } : g,
            );

            this.isPending = true;

            try {
                const updatedGame = await api.makeMove(gameId, newMoves);
                await delay(200);

                this.games = this.games.map((g) =>
                    g.id === updatedGame.id ? updatedGame : g,
                );
            } catch (error) {
                // Move rollback
                this.games = previousGames;
                defaultApiErrorHandler(error);
            } finally {
                this.isPending = false;
            }
        })();

        return true;
    }

    get currentGame() {
        return this.games.find((g) => g.id === this.currentGameId) ?? null;
    }

    get fenPosition() {
        if (!this.currentGame) {
            return DEFAULT_POSITION;
        }
        const chess = getChessValidatorForGame(this.currentGame);
        return chess.fen();
    }

    get extendedGameStatus() {
        if (!this.currentGame) {
            return null;
        }
        const chess = getChessValidatorForGame(this.currentGame);
        return getGameStatus(chess);
    }
}

export const gamesManager = new GamesManager(authManager, pendingStore);
