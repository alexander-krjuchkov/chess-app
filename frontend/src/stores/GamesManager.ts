import { makeAutoObservable, reaction } from 'mobx';
import { PlainGame } from '../types';
import { api } from '../services';
import { defaultApiErrorHandler } from '../utils/error-handler';
import { delay } from '../utils/delay';
import { AuthManager } from './AuthManager';
import { PendingStore } from './PendingStore';
import { GameModel } from '../models';

export class GamesManager {
    private _games: PlainGame[] = [];
    private _currentGame: GameModel | null = null;

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

    private set games(games: PlainGame[]) {
        // This setter is a MobX action to handle property changes correctly.
        this._games = games;
    }

    get games() {
        return this._games;
    }

    private findPlainGameById(gameId: string): PlainGame | null {
        return this.games.find((g) => g.id === gameId) ?? null;
    }

    private setSelectedGame(gameId: string | null) {
        this._currentGame = (() => {
            if (!gameId) {
                return null;
            }
            const plainGame = this.findPlainGameById(gameId);
            if (!plainGame) {
                return null;
            }
            return new GameModel(plainGame);
        })();
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
                this.setSelectedGame(lastUnfinished.id);
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
            this.setSelectedGame(newGame.id);
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
            if (this.currentGame?.id === id) {
                this.setSelectedGame(null);
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
        this.setSelectedGame(id);
    }

    handlePieceDrop(sourceSquare: string, targetSquare: string): boolean {
        const game = this.currentGame;

        if (this.isPending || !game || game.status.isGameOver) {
            return false;
        }

        if (
            !game.isMoveValid({
                sourceSquare,
                targetSquare,
            })
        ) {
            return false;
        }

        void (async () => {
            try {
                this.isPending = true;

                // Optimistic update
                game.move({
                    sourceSquare,
                    targetSquare,
                });

                const updatedGame = await api.makeMove(game.id, game.moves);

                await delay(200);
                game.syncToSourceGameData(updatedGame);
            } catch (error) {
                // Rollback update
                game.rollback();

                defaultApiErrorHandler(error);
            } finally {
                this.isPending = false;
            }
        })();

        return true;
    }

    get currentGame() {
        return this._currentGame;
    }
}
