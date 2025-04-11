import { GameService } from './game.service';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { EngineApiInterface } from '../engine-api/engine-api.interface';
import { NoResultApiError } from '../engine-api/engine-api.errors';
import {
    GameAccessDeniedError,
    GameFinishedError,
    GameNotFoundError,
    InvalidMoveError,
    OutOfSyncError,
} from './game.errors';
import { createGame } from '../../test/utils';
import { GameStatus } from './game-status';

type GameRepositoryMock = Pick<Repository<Game>, 'save' | 'findOne'>;

describe('GameService', () => {
    let mockEngineApi: jest.Mocked<EngineApiInterface>;
    let mockRepository: jest.Mocked<GameRepositoryMock>;
    let service: GameService;

    beforeEach(() => {
        mockEngineApi = {
            getNextMove: jest.fn(),
        };
        mockRepository = {
            save: jest.fn(),
            findOne: jest.fn(),
        };
        service = new GameService(
            mockEngineApi,
            mockRepository as unknown as Repository<Game>,
        );
    });

    function mockFoundGame(game: Partial<Game> | null) {
        mockRepository.findOne.mockResolvedValue(
            game ? createGame(game) : null,
        );
    }

    function mockEngineMove(move: string | null) {
        mockEngineApi.getNextMove.mockImplementation(() =>
            move
                ? Promise.resolve(move)
                : Promise.reject(new NoResultApiError()),
        );
    }

    describe('makeMove', () => {
        it('should throw GameNotFoundError if the game does not exist', async () => {
            mockFoundGame(null);

            await expect(
                service.makeMove('game1', ['e4'], 'user1'),
            ).rejects.toThrow(GameNotFoundError);
        });

        it('should throw GameAccessDeniedError if the game belongs to another user', async () => {
            mockFoundGame({
                id: 'game1',
                userId: 'user1',
                moves: [],
                status: 'in_progress',
            });

            await expect(
                service.makeMove('game1', ['e4'], 'user2'),
            ).rejects.toThrow(GameAccessDeniedError);
        });

        it('should throw GameFinishedError if the game is already finished', async () => {
            // 2-move checkmate. One of the possible sequences: 1.f3 e6 2.g4 Qh4#
            const initialMoves = ['f3', 'e6', 'g4', 'Qh4#'];
            mockFoundGame({
                id: 'game1',
                userId: 'user1',
                moves: initialMoves,
                status: 'black_wins',
            });

            await expect(
                service.makeMove('game1', [...initialMoves, 'e4'], 'user1'),
            ).rejects.toThrow(GameFinishedError);
        });

        it('should throw OutOfSyncError if the move sequence is out of sync', async () => {
            const moves1 = ['e4', 'c5']; // Sicilian Defense opening - 1. e4 c5
            const moves2 = ['e4', 'e5']; // Double King's Pawn Opening - 1.e4 e5
            mockFoundGame({
                id: 'game1',
                userId: 'user1',
                moves: moves1,
                status: 'in_progress',
            });

            await expect(
                service.makeMove('game1', moves2, 'user1'),
            ).rejects.toThrow(OutOfSyncError);
        });

        describe('should throw InvalidMoveError if the move is invalid', () => {
            test.each([
                {
                    move: 'invalid-move',
                    description: 'violation of the move syntax',
                },
                {
                    move: 'e2e5',
                    description: 'violation of the pawn movement rules',
                },
                {
                    move: 'Bf4',
                    description: 'incorrect move with a blocked bishop',
                },
            ])('move "$move" ($description)', async ({ move }) => {
                mockFoundGame({
                    id: 'game1',
                    userId: 'user1',
                    moves: [],
                    status: 'in_progress',
                });

                await expect(
                    service.makeMove('game1', [move], 'user1'),
                ).rejects.toThrow(InvalidMoveError);
            });
        });

        describe('should handle game progress and game end conditions', () => {
            test.each<{
                description: string;
                initialMoves: string[];
                userMove: string;
                engineMove: string | null;
                expectedStatus: GameStatus;
            }>([
                {
                    description:
                        'should continue game with user and engine moves, keeping "in_progress"',
                    // Double King's Pawn Opening - 1.e4 e5
                    initialMoves: [],
                    userMove: 'e4',
                    engineMove: 'e5',
                    expectedStatus: 'in_progress',
                },
                {
                    description:
                        'should finish game as "black_wins" when black checkmates the opponent',
                    // 2-move checkmate. One of the possible sequences: 1.f3 e6 2.g4 Qh4#
                    initialMoves: ['f3', 'e6'],
                    userMove: 'g4',
                    engineMove: 'Qh4#',
                    expectedStatus: 'black_wins',
                },
                {
                    description:
                        'should finish game as "white_wins" when white checkmates the opponent',
                    // 3-move checkmate. One of the possible sequences: 1. e4 g5 2. d4 f6 3. Qh5#.
                    initialMoves: ['e4', 'g5', 'd4', 'f6'],
                    userMove: 'Qh5#',
                    engineMove: null,
                    expectedStatus: 'white_wins',
                },
            ])(
                '$description',
                async ({
                    initialMoves,
                    userMove,
                    engineMove,
                    expectedStatus,
                }) => {
                    mockFoundGame({
                        id: 'game1',
                        userId: 'user1',
                        moves: [...initialMoves],
                        status: 'in_progress',
                    });
                    mockEngineMove(engineMove);

                    const result = await service.makeMove(
                        'game1',
                        [...initialMoves, userMove],
                        'user1',
                    );

                    const expectedMoves = [
                        ...initialMoves,
                        userMove,
                        ...(engineMove ? [engineMove] : []),
                    ];
                    expect(result.moves).toEqual(expectedMoves);
                    expect(result.status).toBe(expectedStatus);
                },
            );
        });

        describe('should format chess move into standard algebraic notation', () => {
            test.each([
                ['g1f3', 'Nf3'],
                ['g1-f3', 'Nf3'],
                ['Ng1f3', 'Nf3'],
                ['Ng1-f3', 'Nf3'],
            ])('"%s" to "%s"', async (unformattedMove, formattedMove) => {
                // Sicilian Defense opening - 1. e4 c5
                const initialMoves = ['e4', 'c5'];
                mockFoundGame({
                    id: 'game1',
                    userId: 'user1',
                    moves: initialMoves,
                    status: 'in_progress',
                });
                const upcomingEngineMove = 'Nf6';
                mockEngineMove(upcomingEngineMove);

                const result = await service.makeMove(
                    'game1',
                    [...initialMoves, unformattedMove],
                    'user1',
                );

                expect(result.moves).toEqual([
                    ...initialMoves,
                    formattedMove,
                    upcomingEngineMove,
                ]);
            });
        });
    });
});
