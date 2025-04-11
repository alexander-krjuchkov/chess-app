import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { config } from '../app-config';

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    controllers: [AuthController],
    providers: [
        JwtStrategy,
        {
            provide: 'AUTH_CLIENT_ID',
            useValue: config.AUTH_CLIENT_ID,
        },
        {
            provide: 'AUTH_PROVIDER_ROOT_URL',
            useValue: config.AUTH_PROVIDER_ROOT_URL,
        },
        {
            provide: 'AUTH_PROVIDER_JWKS_URI',
            useValue: config.AUTH_PROVIDER_JWKS_URI,
        },
    ],
    exports: [PassportModule],
})
export class AuthModule {}
