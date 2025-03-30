import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export function useAuth() {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('AuthContext not found');
    }
    return auth;
}
