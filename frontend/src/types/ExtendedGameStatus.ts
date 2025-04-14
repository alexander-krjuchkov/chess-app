type PlayingExtendedGameStatus = {
    isGameOver: false;
    isCheck: boolean;
    turn: 'white' | 'black';
};

type CheckmateExtendedGameStatus = {
    isGameOver: true;
    gameOverReason: 'checkmate';
    winner: 'white' | 'black';
};

type DrawExtendedGameStatus = {
    isGameOver: true;
    gameOverReason: 'draw';
    drawReason:
        | 'stalemate'
        | '50-move-rule'
        | 'threefold-repetition'
        | 'insufficient-material';
};

type FinishedExtendedGameStatus =
    | CheckmateExtendedGameStatus
    | DrawExtendedGameStatus;

export type ExtendedGameStatus =
    | PlayingExtendedGameStatus
    | FinishedExtendedGameStatus;
