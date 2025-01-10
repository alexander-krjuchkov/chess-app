export type GameStatus = PlayingGameStatus | FinishedGameStatus;

type PlayingGameStatus = {
    isGameOver: false;
    isCheck: boolean;
    turn: 'white' | 'black';
};

type FinishedGameStatus = CheckmateGameStatus | DrawGameStatus;

type CheckmateGameStatus = {
    isGameOver: true;
    gameOverReason: 'checkmate';
    winner: 'white' | 'black';
};

type DrawGameStatus = {
    isGameOver: true;
    gameOverReason: 'draw';
    drawReason:
        | 'stalemate'
        | '50-move-rule'
        | 'threefold-repetition'
        | 'insufficient-material';
};
