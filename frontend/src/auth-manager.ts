import { makeAutoObservable } from 'mobx';
import { User } from './types';
import { userManager } from './user-manager';
import { config } from './config';

export class AuthManager {
    private _user: User | null = null;

    constructor() {
        makeAutoObservable(this);

        const fireCheckAuth = () => void this.checkAuth();
        fireCheckAuth();
        userManager.events.addUserLoaded(fireCheckAuth);
        userManager.events.addUserUnloaded(fireCheckAuth);
    }

    get user() {
        return this._user;
    }

    private set user(user: User | null) {
        // This setter is a MobX action to handle property changes correctly.
        this._user = user;
    }

    /**
     * Should be used once at the top level of the app component structure
     * to handle the sign-in redirect callback from authorization server.
     */
    async handleSignInRedirect() {
        if (window.location.pathname !== config.AUTH_CLIENT_REDIRECT_PATH) {
            return;
        }
        try {
            await userManager.signinRedirectCallback();
        } finally {
            window.history.replaceState(null, '', '/');
        }
    }

    private async checkAuth() {
        this.user = await this.getUser();
    }

    private async getUser(): Promise<User | null> {
        try {
            const user = await userManager.getUser();
            if (!user || user.expired) {
                return null;
            }
            return {
                id: user.profile.sub,
                name: user.profile.preferred_username ?? user.profile.sub,
            };
        } catch (error) {
            console.error('Auth check error:', error);
            return null;
        }
    }
}

export const authManager = new AuthManager();
