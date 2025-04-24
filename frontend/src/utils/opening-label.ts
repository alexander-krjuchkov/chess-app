import { PlainGame } from '../types';

export function getGameOpeningLabel(game: PlainGame) {
    const visibleFullMovesLimit = 10;
    const halfMoves = game.moves ?? [];
    const openingFullMoves = [];
    for (let i = 0; i < halfMoves.length / 2; i++) {
        const moveNumber = i + 1;
        const whiteMove = halfMoves[i * 2] ?? '';
        const blackMove = halfMoves[i * 2 + 1] ?? '';
        const fullMove = `${moveNumber}.${whiteMove} ${blackMove}`.trim();
        openingFullMoves.push(fullMove);
    }

    const openingLabel =
        openingFullMoves.slice(0, visibleFullMovesLimit).join(' ') +
        (openingFullMoves.length > visibleFullMovesLimit ? '...' : '');

    return openingLabel;
}
