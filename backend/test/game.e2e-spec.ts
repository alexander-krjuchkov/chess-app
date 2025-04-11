import { Test } from '@nestjs/testing';
import {
    CanActivate,
    INestApplication,
    UnauthorizedException,
} from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from '../src/game/game.module';
import { EngineApiInterface } from '../src/engine-api/engine-api.interface';
import { EngineApiServiceMock } from './mocks/engine-api.service.mock';
import { AuthGuard } from '@nestjs/passport';
import { DataSource, DataSourceOptions, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from '../src/game/game.entity';
import { GameMock } from './mocks/game.entity.mock';
import { RequestUser } from '../src/auth/auth.types';
import { createGame, jsonClone } from './utils';

// About testing with in memory database (sqlite + jest + typeorm):
// https://dev.to/webeleon/unit-testing-nestjs-with-typeorm-in-memory-l6m
// About cleaning up when testing with a database (jest + typeorm):
// https://stackoverflow.com/questions/49210284/how-to-destroy-test-module-in-nestjs

describe('GameController (e2e)', () => {
    let app: INestApplication | null = null;
    let connection: DataSource | null = null;
    let gameRepository: Repository<GameMock> | null = null;
    let authenticatedUser: RequestUser | null = null;

    beforeEach(async () => {
        const dataSourceOptions: DataSourceOptions = {
            name: 'test',
            type: 'sqlite',
            database: ':memory:',
            entities: [GameMock],
            synchronize: true,
        };
        connection = new DataSource(dataSourceOptions);
        await connection.initialize();

        const moduleFixture = await Test.createTestingModule({
            imports: [TypeOrmModule.forRoot(dataSourceOptions), GameModule],
        })
            .overrideProvider(EngineApiInterface)
            .useClass(EngineApiServiceMock)

            .overrideProvider(getRepositoryToken(Game))
            .useFactory({
                factory: () => connection?.getRepository(GameMock),
            })

            .overrideGuard(AuthGuard())
            .useValue({
                canActivate: (context) => {
                    const request = context.switchToHttp().getRequest();
                    request.user = authenticatedUser; // mock user
                    if (!request.user) {
                        throw new UnauthorizedException();
                    }
                    return !!request.user;
                },
            } satisfies CanActivate)

            .compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        await app.init();

        gameRepository = connection.getRepository(GameMock);

        return {
            app,
            connection,
            gameRepository,
        };
    });

    afterEach(async () => {
        if (connection) {
            await connection.dropDatabase();
            connection = null;
        }

        if (app) {
            await app.close();
            app = null;
        }

        gameRepository = null;
        authenticatedUser = null;
    });

    function authenticateUser(user: RequestUser) {
        authenticatedUser = user;
    }

    function getAppHttpServer() {
        return app?.getHttpServer();
    }

    async function addGame(game: Partial<Game>) {
        if (!gameRepository) {
            throw new Error('gameRepository is not initialized');
        }
        const entity = gameRepository.create(createGame(game));
        return await gameRepository.save(entity);
    }

    async function addGames(games: Partial<Game>[]) {
        for (const game of games) {
            await addGame(game);
        }
    }

    describe('GET /api/game/list', () => {
        it('should return 401 if no authentication is provided', async () => {
            await request(getAppHttpServer()) //
                .get('/api/game/list')
                .expect(401);
        });

        it('should return 200 and a list of user games ordered by createdAt DESC', async () => {
            const game1: Partial<Game> = {
                id: 'game1',
                userId: 'user1',
                moves: ['e4', 'c5'],
                status: 'in_progress',
                createdAt: new Date('2023-10-01T00:00:00Z'),
            };
            const game2: Partial<Game> = {
                id: 'game2',
                userId: 'user2', // different user
                moves: ['e4', 'c5', 'Nf3', 'd6'],
                status: 'in_progress',
                createdAt: new Date('2023-10-02T00:00:00Z'),
            };
            const game3: Partial<Game> = {
                id: 'game3',
                userId: 'user1',
                moves: ['f3', 'e6', 'g4', 'Qh4#'],
                status: 'black_wins',
                createdAt: new Date('2023-10-03T00:00:00Z'),
            };
            await addGames([game1, game2, game3]);

            authenticateUser({ userId: 'user1' });
            const response = await request(getAppHttpServer())
                .get('/api/game/list')
                .expect(200);

            expect(response.body).toMatchObject(jsonClone([game3, game1]));
        });
    });

    describe('POST /api/game/create', () => {
        it('should return 401 if no authentication is provided', async () => {
            await request(getAppHttpServer())
                .post('/api/game/create')
                .expect(401);
        });

        it('should create a new game for authenticated user and return 201', async () => {
            authenticateUser({ userId: 'user1' });
            const response = await request(getAppHttpServer())
                .post('/api/game/create')
                .expect(201);
            expect(response.body).toMatchObject({
                id: expect.any(String),
                userId: 'user1',
                moves: [],
                status: 'in_progress',
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        });
    });

    describe('PATCH /api/game/:id/move', () => {
        // TODO: should return 400 if request is invalid

        it('should return 401 if no authentication is provided', async () => {
            const { id: gameId } = await addGame({ userId: 'user1' });

            await request(getAppHttpServer())
                .patch(`/api/game/${gameId}/move`)
                .expect(401);
        });

        it('should return 404 when game not found', async () => {
            const gameId = 'non-existent';

            authenticateUser({ userId: 'user1' });
            await request(getAppHttpServer())
                .patch(`/api/game/${gameId}/move`)
                .send({ moves: ['e4'] })
                .expect(404)
                .expect({ code: 'gameNotFound' });
        });

        it('should return 403 when user does not have access to the game', async () => {
            const { id: gameId } = await addGame({ userId: 'user1' });
            authenticateUser({ userId: 'user2' });

            await request(getAppHttpServer())
                .patch(`/api/game/${gameId}/move`)
                .send({ moves: ['e4'] })
                .expect(403);
        });

        it('should return 409 when game is already finished', async () => {
            const { id: gameId } = await addGame({
                userId: 'user1',
                // One of the 2-move checkmate sequences: 1.f3 e6 2.g4 Qh4#
                moves: ['f3', 'e6', 'g4', 'Qh4#'],
                status: 'black_wins',
            });

            authenticateUser({ userId: 'user1' });
            await request(getAppHttpServer())
                .patch(`/api/game/${gameId}/move`)
                .send({ moves: ['e4'] })
                .expect(409)
                .expect({ code: 'gameFinished' });
        });

        it('should return 409 when game moves are out of sync', async () => {
            const moves1 = ['e4', 'c5']; // Sicilian Defense opening - 1. e4 c5
            const moves2 = ['e4', 'e5']; // Double King's Pawn Opening - 1.e4 e5
            const { id: gameId } = await addGame({
                userId: 'user1',
                moves: moves1,
            });

            authenticateUser({ userId: 'user1' });
            await request(getAppHttpServer())
                .patch(`/api/game/${gameId}/move`)
                .send({ moves: moves2 })
                .expect(409)
                .expect({ code: 'outOfSync' });
        });

        it('should return 400 when invalid move', async () => {
            const { id: gameId } = await addGame({ userId: 'user1' });

            authenticateUser({ userId: 'user1' });
            await request(getAppHttpServer())
                .patch(`/api/game/${gameId}/move`)
                .send({ moves: ['invalid-move'] })
                .expect(400)
                .expect({ code: 'invalidMove' });
        });

        it('should return 200 and an updated game when valid move', async () => {
            const initialMoves = ['e4', 'c5'];
            const { id: gameId } = await addGame({
                userId: 'user1',
                moves: initialMoves,
            });
            const userMove = 'Nf3';

            authenticateUser({ userId: 'user1' });
            const response = await request(getAppHttpServer())
                .patch(`/api/game/${gameId}/move`)
                .send({ moves: [...initialMoves, userMove] })
                .expect(200);
            expect(response.body).toMatchObject({
                id: gameId,
                userId: 'user1',
                moves: [...initialMoves, userMove, expect.any(String)],
                status: 'in_progress',
            });
        });
    });

    describe('DELETE /api/game/:id', () => {
        it('should return 401 if no authentication is provided', async () => {
            const { id: gameId } = await addGame({ userId: 'user1' });

            await request(getAppHttpServer())
                .delete(`/api/game/${gameId}`)
                .expect(401);
        });

        it('should return 404 when game not found', async () => {
            const gameId = 'non-existent';

            authenticateUser({ userId: 'user1' });
            await request(getAppHttpServer())
                .delete(`/api/game/${gameId}`)
                .expect(404)
                .expect({ code: 'gameNotFound' });
        });

        it('should return 403 when user does not have access to the game', async () => {
            const { id: gameId } = await addGame({ userId: 'user1' });
            authenticateUser({ userId: 'user2' });

            await request(getAppHttpServer())
                .delete(`/api/game/${gameId}`)
                .expect(403);
        });

        it('should delete the game and return 204', async () => {
            const { id: gameId } = await addGame({ userId: 'user1' });

            authenticateUser({ userId: 'user1' });
            await request(getAppHttpServer())
                .delete(`/api/game/${gameId}`)
                .expect(204);

            const game = await gameRepository?.findOneBy({ id: gameId });
            expect(game).toBeNull();
        });
    });
});
