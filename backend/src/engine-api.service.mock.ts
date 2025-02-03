import { Injectable } from '@nestjs/common';
import { Chess } from 'chess.js';
import { EngineApiInterface } from './engine-api.interface';
import { Payload } from './engine-api.types';

@Injectable()
export class MockEngineApiService implements EngineApiInterface {
    async getNextMove({ fen }: Payload): Promise<string> {
        const game = new Chess(fen);
        const possibleMoves = game.moves();
        const randomMove = this.getRandomArrayElement(possibleMoves);
        if (!randomMove) {
            throw new Error('No possible moves');
        }
        return Promise.resolve(randomMove);
    }

    private getRandomArrayElement<T>(array: T[]): T | undefined {
        return array[Math.floor(Math.random() * array.length)];
    }
}
