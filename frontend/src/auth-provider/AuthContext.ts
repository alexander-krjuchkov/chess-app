import { createContext } from 'react';
import { User } from 'oidc-client-ts';

type AuthContextProps = {
    user: User | null;
};

export const AuthContext = createContext<AuthContextProps | null>(null);
