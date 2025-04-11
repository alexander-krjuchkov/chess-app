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

async function fetchWithAuth<Result = unknown>(
    url: string,
    options?: RequestInit,
): Promise<Result> {
    const user = await userManager.getUser();
    const headers = new Headers(options?.headers);

    if (user?.access_token) {
        headers.set('Authorization', `Bearer ${user.access_token}`);
    }

    const response = await fetch(url, { ...options, headers });

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

// eslint-disable-next-line
(window as any)._loadAndPrintProfileForDebug = () => {
    fetchWithAuth('/api/auth/profile')
        .then((profile) => console.log('Profile:', profile))
        .catch((error) => console.error('Profile load error:', error));
};

export async function getGames(): Promise<Game[]> {
    return fetchWithAuth<Game[]>('/api/game/list');
}

export async function createGame(): Promise<Game> {
    return fetchWithAuth<Game>('/api/game/create', { method: 'POST' });
}

export async function makeMove(gameId: string, moves: string[]): Promise<Game> {
    return fetchWithAuth<Game>(`/api/game/${gameId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moves }),
    });
}

export async function deleteGame(id: string): Promise<void> {
    await fetchWithAuth(`/api/game/${id}`, { method: 'DELETE' });
}
