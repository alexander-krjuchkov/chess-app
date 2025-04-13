import { observer } from 'mobx-react-lite';
import { userManager } from '../user-manager';
import { authManager } from '../auth-manager';

const login = () => {
    void userManager.signinRedirect();
};

const LoginButton = () => (
    <button type='button' onClick={login}>
        Sign in
    </button>
);

const logout = () => {
    void userManager.signoutRedirect();
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
