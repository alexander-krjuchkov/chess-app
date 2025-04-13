import { AccountPanel } from './AccountPanel';
import { AuthProtected } from './AuthProtected';
import { useSignInRedirectCallback } from '../hooks';

export function App() {
    useSignInRedirectCallback();

    return (
        <>
            <AccountPanel />
            <AuthProtected />
        </>
    );
}
