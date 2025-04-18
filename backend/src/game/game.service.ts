import { Inject, Injectable } from '@nestjs/common';
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
import { GameModel } from './game.model';

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
        const gameEntity = await this.getUserGameById(gameId, userId);

        if (gameEntity.status !== 'in_progress') {
            throw new GameFinishedError();
        }

        if (
            gameEntity.moves.length !== moves.length - 1 ||
            !gameEntity.moves.every((move, index) => move === moves[index])
        ) {
            throw new OutOfSyncError();
        }

        const lastMove = moves.at(-1);
        if (!lastMove) {
            throw new InvalidMoveError();
        }

        const gameModel = new GameModel(gameEntity);

        if (!gameModel.isValidMove(lastMove)) {
            throw new InvalidMoveError();
        }

        gameModel.move(lastMove);

        if (gameModel.isInProgress) {
            const fen = gameModel.fen;
            const nextMove = await this.engineApiService.getNextMove({ fen });
            gameModel.move(nextMove);
        }

        await this.gameRepository.save(gameEntity);

        return gameEntity;
    }

    async deleteGame(id: string, userId: string): Promise<void> {
        const game = await this.getUserGameById(id, userId);
        await this.gameRepository.remove(game);
    }
}
