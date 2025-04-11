import { Inject, Injectable } from '@nestjs/common';
import { Chess, WHITE } from 'chess.js';
import {
    GameAccessDeniedError,
    GameFinishedError,
    GameNotFoundError,
    InvalidMoveError,
    OutOfSyncError,
} from './game.errors';
import { EngineApiInterface } from '../engine-api/engine-api.interface';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GameStatus } from './game-status';

@Injectable()
export class GameService {
    constructor(
        @Inject(EngineApiInterface)
        private engineApiService: EngineApiInterface,
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
    ) {}

    async getGamesByUser(userId: string): Promise<Game[]> {
        return this.gameRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async createGame(userId: string): Promise<Game> {
        const game = this.gameRepository.create({
            userId,
            moves: [],
            status: 'in_progress',
        });
        return this.gameRepository.save(game);
    }

    async getUserGameById(id: string, userId: string): Promise<Game> {
        const game = await this.gameRepository.findOne({
            where: { id },
        });
        if (!game) {
            throw new GameNotFoundError();
        }
        if (game.userId !== userId) {
            throw new GameAccessDeniedError();
        }
        return game;
    }

    async makeMove(
        gameId: string,
        moves: string[],
        userId: string,
    ): Promise<Game> {
        const game = await this.getUserGameById(gameId, userId);
        if (game.status !== 'in_progress') {
            throw new GameFinishedError();
        }

        if (
            game.moves.length !== moves.length - 1 ||
            !game.moves.every((move, index) => move === moves[index])
        ) {
            throw new OutOfSyncError();
        }
        const chess = new Chess();
        game.moves.forEach((move) => chess.move(move));
        const lastMove = moves.at(-1);
        if (!lastMove) {
            throw new InvalidMoveError();
        }
        try {
            chess.move(lastMove);
        } catch (e) {
            if (e instanceof Error && e.message.includes('Invalid move')) {
                throw new InvalidMoveError();
            }
            throw e;
        }
        game.moves = chess.history();
        game.status = this.determineStatus(chess);
        if (game.status === 'in_progress') {
            const fen = chess.fen();
            const nextMove = await this.engineApiService.getNextMove({ fen });
            chess.move(nextMove);
            game.moves = chess.history();
            game.status = this.determineStatus(chess);
        }
        await this.gameRepository.save(game);
        return game;
    }

    private determineStatus(chess: Chess): GameStatus {
        if (!chess.isGameOver()) {
            return 'in_progress';
        }
        if (chess.isDraw()) {
            return 'draw';
        }
        if (chess.turn() === WHITE) {
            return 'black_wins';
        }
        return 'white_wins';
    }

    async deleteGame(id: string, userId: string): Promise<void> {
        const game = await this.getUserGameById(id, userId);
        await this.gameRepository.remove(game);
    }
}
