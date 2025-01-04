import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GameModule } from '../src/game.module';
import { isValidNextMove } from './utils';

describe('GameController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [GameModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        await app.init();
    });

    describe('POST /api/game/move', () => {
        // TODO: should return 400 if request is invalid

        it('should return 400 if moves sequence is invalid', async () => {
            await request(app.getHttpServer())
                .post('/api/game/move')
                .send({ moves: ['e2e4', 'e2e5'] })
                .expect(400);
        });

        it('should return 200 and valid next move if request is valid', async () => {
            const history = ['e2e4', 'e7e5'];

            const response = await request(app.getHttpServer())
                .post('/api/game/move')
                .send({ moves: history })
                .expect(200);

            expect(isValidNextMove(history, response.body.nextMove)).toBe(true);
        });
    });
});
