import { observer } from 'mobx-react-lite';
import { authManager } from '../stores';

const login = () => {
    void authManager.signInRedirect();
};

const LoginButton = () => (
    <button type='button' onClick={login}>
        Sign in
    </button>
);

const logout = () => {
    void authManager.signOutRedirect();
};

const LogoutButton = () => (
    <button type='button' onClick={logout}>
        Sign out
    </button>
);

export const AccountPanel = observer(function AccountPanel() {
    const user = authManager.user;

    return (
        <div>
            {user && user.name}
            {user ? <LogoutButton /> : <LoginButton />}
        </div>
    );
});
