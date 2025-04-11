import { Injectable } from '@nestjs/common';
import { Chess } from 'chess.js';
import { EngineApiInterface } from '../../src/engine-api/engine-api.interface';
import { Payload } from '../../src/engine-api/engine-api.types';
import { NoResultApiError } from '../../src/engine-api/engine-api.errors';
import { getRandomArrayElement } from '../utils';

/**
 * Mock engine that returns a random valid next move
 */
@Injectable()
export class EngineApiServiceMock implements EngineApiInterface {
    async getNextMove({ fen }: Payload): Promise<string> {
        const game = new Chess(fen);
        const possibleMoves = game.moves();
        const randomMove = getRandomArrayElement(possibleMoves);
        if (!randomMove) {
            throw new NoResultApiError();
        }
        return Promise.resolve(randomMove);
    }
}
