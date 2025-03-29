import { useEffect, useRef } from 'react';
import { userManager } from '../user-manager';
import { config } from '../config';

/**
 * Handles sign-in redirect callback from authorization server.
 * Should be used once at the top level of the app component structure.
 */
export function useSignInRedirectCallback() {
    const processStarted = useRef(false);

    useEffect(() => {
        if (processStarted.current) {
            // block double running in react StrictMode
            return;
        }
        processStarted.current = true;

        const handleAuthCallback = async () => {
            if (window.location.pathname !== config.AUTH_CLIENT_REDIRECT_PATH) {
                return;
            }
            try {
                await userManager.signinRedirectCallback();
            } finally {
                window.history.replaceState(null, '', '/');
            }
        };

        void handleAuthCallback();
    }, []);
}
