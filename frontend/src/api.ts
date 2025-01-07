type NextMoveResponse = { nextMove?: string };

export async function getNextMove(
    moves: string[],
): Promise<string | undefined> {
    const response = await fetch('/api/game/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moves }),
    });
    const { nextMove } = (await response.json()) as NextMoveResponse;
    return nextMove;
}
