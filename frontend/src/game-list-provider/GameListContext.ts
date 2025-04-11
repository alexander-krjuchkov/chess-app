import { createContext } from 'react';
import { Game } from '../types';

type GameListContextProps = {
    games: Game[];
    currentGameId: string | null;
    setGames: (games: Game[] | ((prev: Game[]) => Game[])) => void;
    createGame: () => void;
    deleteGame: (id: string) => void;
    selectGame: (id: string | null) => void;
};

export const GameListContext = createContext<GameListContextProps | null>(null);
