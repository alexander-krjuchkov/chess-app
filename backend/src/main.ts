import { NestFactory } from '@nestjs/core';
import { GameModule } from './game.module';

async function bootstrap() {
    const app = await NestFactory.create(GameModule);
    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
