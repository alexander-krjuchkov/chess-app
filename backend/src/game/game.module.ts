import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { EngineApiInterface } from '../engine-api/engine-api.interface';
import { EngineApiService } from '../engine-api/engine-api.service';
import { EngineApiModule } from '../engine-api/engine-api.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Game]), EngineApiModule, AuthModule],
    controllers: [GameController],
    providers: [
        {
            provide: EngineApiInterface,
            useExisting: EngineApiService,
        },
        GameService,
    ],
})
export class GameModule {}
