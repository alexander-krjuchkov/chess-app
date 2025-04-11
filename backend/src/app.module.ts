import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './orm-config';

@Module({
    imports: [
        GameModule,
        TypeOrmModule.forRoot({
            ...dataSourceOptions,
        }),
    ],
})
export class AppModule {}
