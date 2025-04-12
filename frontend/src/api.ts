import {
    AuthError,
    GameFinishedError,
    GameNotFoundError,
    InvalidMoveError,
    OutOfSyncError,
    ServerError,
    UnknownApiError,
} from './errors/api-errors';
import { Game } from './types';
import { userManager } from './user-manager';

class Api {
    private async request<Result = unknown>(
        url: string,
        method: string,
        body?: unknown,
    ): Promise<Result> {
        const user = await userManager.getUser();
        const headers = new Headers();

        if (user?.access_token) {
            headers.set('Authorization', `Bearer ${user.access_token}`);
        }

        if (body) {
            headers.set('Content-Type', 'application/json');
        }

        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (response.ok) {
            if (response.status === 204) {
                return undefined as Result;
            }

            return (await response.json()) as Result;
        }

        let errorData: unknown;
        try {
            errorData = await response.json();
        } catch (parseError) {
            console.error(parseError);
            errorData = {};
        }

        let errorCode: unknown;
        if (
            typeof errorData === 'object' &&
            errorData !== null &&
            'code' in errorData
        ) {
            errorCode = errorData.code;
        }

        switch (true) {
            case response.status === 401 || response.status === 403:
                throw new AuthError();
            case response.status >= 500:
                throw new ServerError();
            case errorCode === 'outOfSync':
                throw new OutOfSyncError();
            case errorCode === 'gameFinished':
                throw new GameFinishedError();
            case errorCode === 'gameNotFound':
                throw new GameNotFoundError();
            case errorCode === 'invalidMove':
                throw new InvalidMoveError();
            default:
                throw new UnknownApiError();
        }
    }

    public async getGames(): Promise<Game[]> {
        return this.request<Game[]>('/api/game/list', 'GET');
    }

    public async createGame(): Promise<Game> {
        return this.request<Game>('/api/game/create', 'POST');
    }

    public async makeMove(gameId: string, moves: string[]): Promise<Game> {
        return this.request<Game>(`/api/game/${gameId}/move`, 'PATCH', {
            moves,
        });
    }

    public async deleteGame(id: string): Promise<void> {
        await this.request(`/api/game/${id}`, 'DELETE');
    }
}

export const api = new Api();
