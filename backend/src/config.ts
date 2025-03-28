// prettier-ignore
export const config = {
    BEST_MOVE_URL:
        process.env.BEST_MOVE_URL ||
        'http://localhost:5000/best-move',

    AUTH_CLIENT_ID:
        process.env.AUTH_CLIENT_ID ||
        'my-app-frontend',

    AUTH_PROVIDER_ROOT_URL:
        process.env.AUTH_PROVIDER_ROOT_URL ||
        'http://localhost:8080/realms/my-realm',

    AUTH_PROVIDER_JWKS_URI:
        process.env.AUTH_PROVIDER_JWKS_URI ||
        'http://localhost:8080/realms/my-realm/protocol/openid-connect/certs',
};
