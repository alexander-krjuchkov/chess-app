// prettier-ignore
export const config = {
    AUTH_PROVIDER_ROOT_URL: String(
        import.meta.env.AUTH_PROVIDER_ROOT_URL ||
        'http://localhost:8080/realms/my-realm',
    ),

    AUTH_CLIENT_ID: String(
        import.meta.env.AUTH_CLIENT_ID ||
        'my-app-frontend'
    ),

    AUTH_CLIENT_URL_ORIGIN: String(
        import.meta.env.AUTH_CLIENT_URL_ORIGIN ||
        'http://localhost:5173',
    ),

    AUTH_CLIENT_REDIRECT_PATH: String(
        import.meta.env.AUTH_CLIENT_REDIRECT_PATH ||
        '/auth-callback',
    ),

    AUTH_CLIENT_POST_LOGOUT_REDIRECT_PATH: String(
        import.meta.env.AUTH_CLIENT_POST_LOGOUT_REDIRECT_PATH ||
        '/',
    ),
};
