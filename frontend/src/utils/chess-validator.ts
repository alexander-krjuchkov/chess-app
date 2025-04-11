import { Chess } from 'chess.js';
import { Game } from '../types';

export function getChessValidatorForGame(game: Game) {
    const chessInstance = new Chess();
    game.moves.forEach((move) => chessInstance.move(move));
    return chessInstance;
}
