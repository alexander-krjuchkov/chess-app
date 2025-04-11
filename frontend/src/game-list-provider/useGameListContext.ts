import { useContext } from 'react';
import { GameListContext } from './GameListContext';

export function useGameListContext() {
    const context = useContext(GameListContext);
    if (!context) {
        throw new Error('GameListContext not found');
    }
    return context;
}
