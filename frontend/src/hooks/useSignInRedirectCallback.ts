import { useEffect, useRef } from 'react';
import { authManager } from '../stores';

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

        void authManager.handleSignInRedirect();
    }, []);
}
