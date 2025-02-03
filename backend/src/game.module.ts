import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { EngineApiInterface } from './engine-api.interface';
import { EngineApiService } from './engine-api.service';

@Module({
    imports: [],
    controllers: [GameController],
    providers: [
        {
            provide: 'BEST_MOVE_URL',
            useValue:
                process.env.BEST_MOVE_URL || 'http://localhost:5000/best-move',
        },
        {
            provide: EngineApiInterface,
            useClass: EngineApiService,
        },
        GameService,
    ],
})
export class GameModule {}
