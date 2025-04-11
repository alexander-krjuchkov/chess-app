import { createContext } from 'react';
import { ExtendedGameStatus, Game } from '../types';

type GameContextProps = {
    currentGame: Game | null;
    fenPosition: string;
    extendedGameStatus: ExtendedGameStatus | null;
    handlePieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
};

export const GameContext = createContext<GameContextProps | null>(null);
