import { useContext } from 'react';
import { GameContext } from './GameContext';

export function useGameContext() {
    const game = useContext(GameContext);
    if (!game) {
        throw new Error('GameContext not found');
    }
    return game;
}
