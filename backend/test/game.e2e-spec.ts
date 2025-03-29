import { Test } from '@nestjs/testing';
import { CanActivate, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { isValidNextMove } from './utils';
import { EngineApiInterface } from '../src/engine-api/engine-api.interface';
import { MockEngineApiService } from '../src/engine-api/engine-api.service.mock';
import { AuthGuard } from '@nestjs/passport';

describe('GameController (e2e)', () => {
    async function createApp({
        mockAuthorized,
    }: {
        mockAuthorized: boolean;
    }): Promise<INestApplication> {
        const moduleFixtureBuilder = Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(EngineApiInterface)
            .useClass(MockEngineApiService);

        if (mockAuthorized) {
            moduleFixtureBuilder.overrideGuard(AuthGuard()).useValue({
                canActivate: () => true,
            } as CanActivate);
        }

        const moduleFixture = await moduleFixtureBuilder.compile();
        const app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        return await app.init();
    }

    describe('POST /api/game/move', () => {
        it('should return 401 if no authorization is provided', async () => {
            const app = await createApp({ mockAuthorized: false });
            await request(app.getHttpServer())
                .post('/api/game/move')
                .expect(401);
        });

        // TODO: should return 400 if request is invalid

        it('should return 400 if moves sequence is invalid', async () => {
            const app = await createApp({ mockAuthorized: true });
            await request(app.getHttpServer())
                .post('/api/game/move')
                .send({ moves: ['e2e4', 'e2e5'] })
                .expect(400);
        });

        it('should return 200 and valid next move if request is valid', async () => {
            const history = ['e2e4', 'e7e5'];

            const app = await createApp({ mockAuthorized: true });
            const response = await request(app.getHttpServer())
                .post('/api/game/move')
                .send({ moves: history })
                .expect(200);

            expect(isValidNextMove(history, response.body.nextMove)).toBe(true);
        });
    });
});
