import { userManager } from './user-manager';
import { useAuth } from './AuthContext';

const login = () => {
    void userManager.signinRedirect();
};

const LoginButton = () => (
    <button type='button' onClick={login}>
        Войти
    </button>
);

const logout = () => {
    void userManager.signoutRedirect();
};

const LogoutButton = () => (
    <button type='button' onClick={logout}>
        Выйти
    </button>
);

export function AccountPanel() {
    const { user } = useAuth();
    return (
        <div>
            {user && user.profile.preferred_username}
            {user ? <LogoutButton /> : <LoginButton />}
        </div>
    );
}
