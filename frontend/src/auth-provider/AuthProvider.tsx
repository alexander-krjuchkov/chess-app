import { ReactNode, useEffect, useState } from 'react';
import { User } from 'oidc-client-ts';
import { userManager } from '../user-manager';
import { AuthContext } from './AuthContext';
import { useSignInRedirectCallback } from './useSignInRedirectCallback';

/**
 * Should be used once at the top level of the app component structure
 * to handle the sign-in redirect callback from authorization server.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    useSignInRedirectCallback();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function checkAuth() {
            try {
                const user = await userManager.getUser();
                setUser(user && !user.expired ? user : null);
            } catch (error) {
                console.error('Auth check error:', error);
                setUser(null);
            }
        }

        function fireCheckAuth() {
            void checkAuth();
        }

        fireCheckAuth();

        userManager.events.addUserLoaded(fireCheckAuth);
        userManager.events.addUserUnloaded(fireCheckAuth);

        return () => {
            userManager.events.removeUserLoaded(fireCheckAuth);
            userManager.events.removeUserUnloaded(fireCheckAuth);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
}
