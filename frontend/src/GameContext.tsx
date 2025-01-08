import { createContext, useContext } from 'react';

type GameContextProps = {
    moves: string[];
    fenPosition: string;
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
