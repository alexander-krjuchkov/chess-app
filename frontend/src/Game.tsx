import { useAuth } from './AuthContext';
import { Board } from './Board';
import { StatusBar } from './StatusBar';

export function Game() {
    const { user } = useAuth();

    if (!user) {
        return <>Please sign in to continue</>;
    }

    return (
        <>
            <StatusBar />
            <Board />
        </>
    );
}
