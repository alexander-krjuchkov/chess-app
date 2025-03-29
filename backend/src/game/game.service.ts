import { Inject, Injectable } from '@nestjs/common';
import { Chess } from 'chess.js';
import { InvalidMoveError } from './invalid-move.error';
import { EngineApiInterface } from '../engine-api/engine-api.interface';

@Injectable()
export class GameService {
    constructor(
        @Inject(EngineApiInterface)
        private engineApiService: EngineApiInterface,
    ) {}

    async getNextMove(moves: string[]): Promise<string> {
        try {
            const game = new Chess();

            for (const move of moves) {
                game.move(move);
            }

            const fen = game.fen();

            return await this.engineApiService.getNextMove({ fen });
        } catch (e) {
            if (e instanceof Error && e.message.includes('Invalid move')) {
                throw new InvalidMoveError('Invalid move sequence');
            }
            throw e;
        }
    }
}
