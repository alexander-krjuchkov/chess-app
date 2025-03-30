import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('AUTH_CLIENT_ID') clientId: string,
        @Inject('AUTH_PROVIDER_ROOT_URL') providerRootUrl: string,
        @Inject('AUTH_PROVIDER_JWKS_URI') providerJwksUri: string,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: passportJwtSecret({
                jwksUri: providerJwksUri,
                handleSigningKeyError: (err, cb) => {
                    console.error('Signing key error:', err);
                    cb(err);
                },
            }),
            issuer: providerRootUrl,
            audience: clientId,
        });
    }

    async validate(payload: any) {
        // console.log(JSON.stringify(payload, null, 2));

        return {
            userId: payload.sub,
            email: payload.email_verified ? payload.email : undefined,
            username: payload.preferred_username,
        };
    }
}
