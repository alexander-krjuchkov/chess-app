import { Module } from '@nestjs/common';
import { EngineApiService } from '../engine-api/engine-api.service';
import { config } from '../config';

@Module({
    providers: [
        {
            provide: 'BEST_MOVE_URL',
            useValue: config.BEST_MOVE_URL,
        },
        EngineApiService,
    ],
    exports: [EngineApiService],
})
export class EngineApiModule {}
