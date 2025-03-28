import {
    OidcClientSettings,
    UserManager,
    WebStorageStateStore,
} from 'oidc-client-ts';
import { config } from './config';

// prettier-ignore
const oidcConfig: OidcClientSettings = {
    authority: config.AUTH_PROVIDER_ROOT_URL,
    client_id: config.AUTH_CLIENT_ID,
    redirect_uri:
        config.AUTH_CLIENT_URL_ORIGIN +
        config.AUTH_CLIENT_REDIRECT_PATH,
    post_logout_redirect_uri:
        config.AUTH_CLIENT_URL_ORIGIN +
        config.AUTH_CLIENT_POST_LOGOUT_REDIRECT_PATH,
    scope: 'openid profile email',
    loadUserInfo: true,
};

export const userManager = new UserManager({
    ...oidcConfig,
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({ store: localStorage }),
});
