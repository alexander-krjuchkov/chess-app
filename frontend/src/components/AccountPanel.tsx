import { userManager } from '../user-manager';
import { useAuth } from '../auth-provider';

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

export function AccountPanel() {
    const { user } = useAuth();
    return (
        <div>
            {user && user.profile.preferred_username}
            {user ? <LogoutButton /> : <LoginButton />}
        </div>
    );
}
