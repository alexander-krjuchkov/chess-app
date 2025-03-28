import { userManager } from './user-manager';

async function fetchWithAuth<R = unknown>(
    url: RequestInfo | URL,
    options?: RequestInit,
): Promise<R> {
    const user = await userManager.getUser();
    const headers = new Headers(options?.headers);

    if (user?.access_token) {
        headers.set('Authorization', `Bearer ${user.access_token}`);
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return (await response.json()) as R;
}

type NextMoveResponse = { nextMove: string };

// eslint-disable-next-line
(window as any)._loadAndPrintProfileForDebug = () => {
    fetchWithAuth('/api/auth/profile')
        .then((profile) => console.log('Profile:', profile))
        .catch((error) => console.error('Profile load error:', error));
};

export async function getComputerMove(
    moves: string[],
): Promise<string | undefined> {
    // TODO: handle errors
    const { nextMove } = await fetchWithAuth<NextMoveResponse>(
        '/api/game/move',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ moves }),
        },
    );
    if (nextMove === '(none)') {
        return undefined;
    }
    return nextMove;
}
