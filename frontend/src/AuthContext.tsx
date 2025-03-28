import { createContext, useContext } from 'react';
import { User } from 'oidc-client-ts';

type AuthContextProps = {
    user: User | null;
};

export const AuthContext = createContext<AuthContextProps | null>(null);

export function useAuth() {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('AuthContext not found');
    }
    return auth;
}
