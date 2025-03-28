import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { EngineApiInterface } from './engine-api.interface';
import { EngineApiService } from './engine-api.service';
import { AuthModule } from './auth.module';
import { config } from './config';

@Module({
    imports: [AuthModule],
    controllers: [GameController],
    providers: [
        {
            provide: 'BEST_MOVE_URL',
            useValue: config.BEST_MOVE_URL,
        },
        {
            provide: EngineApiInterface,
            useClass: EngineApiService,
        },
        GameService,
    ],
})
export class GameModule {}
