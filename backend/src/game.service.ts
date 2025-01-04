import { Injectable } from '@nestjs/common';
import { Chess } from 'chess.js';
import { InvalidMoveError } from './invalid-move.error';

@Injectable()
export class GameService {
    getNextMove(moves: string[]): string | undefined {
        try {
            const game = new Chess();

            for (const move of moves) {
                game.move(move);
            }

            const possibleMoves = game.moves();
            const randomMove = this.getRandomArrayElement(possibleMoves);
            return randomMove;
        } catch (e) {
            if (e instanceof Error && e.message.includes('Invalid move')) {
                throw new InvalidMoveError('Invalid move sequence');
            }
            throw e;
        }
    }

    private getRandomArrayElement<T>(array: T[]): T | undefined {
        return array[Math.floor(Math.random() * array.length)];
    }
}
