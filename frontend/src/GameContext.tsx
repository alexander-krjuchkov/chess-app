import { createContext, useContext } from 'react';
import { GameStatus } from './types';

type GameContextProps = {
    moves: string[];
    fenPosition: string;
    gameStatus: GameStatus;
    handlePieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
};

export const GameContext = createContext<GameContextProps | null>(null);

export function useGameContext() {
    const game = useContext(GameContext);
    if (!game) {
        throw new Error('GameContext not found');
    }
    return game;
}
