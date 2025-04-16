import { makeAutoObservable } from 'mobx';
import { CoordinateNotationMove, PlainGame } from './types';
import { GameStatus } from './GameStatus';
import { ChessLogic } from './ChessLogic';

/**
 * Observable and editable game model
 *
 * Accepts a MobX proxy in the constructor and
 * updates it to synchronize the state in the application
 */
export class GameModel {
    /**
     * Observable plain proxy for game synchronization
     */
    private sourceGame: PlainGame;

    /**
     * Non-observable chess.js facade
     *
     * It is a wrapper over a third-party library,
     * the object of which will not be observable
     * and should not be a dependency of the computed ones.
     */
    private chess: ChessLogic;

    /**
     * Observable calculated game state
     */
    private calculatedState: {
        fenPosition: string;
        status: GameStatus;
        moves: string[];
    };

    public constructor(sourceGame: PlainGame) {
        makeAutoObservable(this);

        this.sourceGame = sourceGame;
        this.chess = new ChessLogic(sourceGame.moves);
        this.calculatedState = this.computeCalculatedState();
    }

    /**
     * Calculate game state based on chess logic
     */
    private computeCalculatedState() {
        return {
            fenPosition: this.chess.fenPosition,
            status: this.chess.status,
            moves: this.chess.moves,
        };
    }

    /**
     * Update model based on new data from a plain game
     */
    public syncToSourceGameData(plainGame: PlainGame): void {
        if (plainGame.id !== this.sourceGame.id) {
            throw new Error('Game id mismatch');
        }

        this.sourceGame.moves = plainGame.moves;
        this.sourceGame.status = plainGame.status;
        this.sourceGame.updatedAt = plainGame.updatedAt;

        this.chess = new ChessLogic(plainGame.moves);
        this.refreshCalculatedState();
    }

    /**
     * Update calculated game state
     */
    private refreshCalculatedState(): void {
        this.calculatedState = this.computeCalculatedState();
    }

    /**
     * Sync source plain game with current chess logic state
     */
    private syncSourceGame(): void {
        this.sourceGame.moves = this.chess.moves;
        this.sourceGame.status = (() => {
            if (!this.chess.status.isGameOver) {
                return 'in_progress';
            }
            if (this.chess.status.gameOverReason === 'draw') {
                return 'draw';
            }
            if (this.chess.status.winner === 'white') {
                return 'black_wins';
            }
            return 'white_wins';
        })();
    }

    public isMoveValid(move: CoordinateNotationMove): boolean {
        return this.chess.isValidMove(move);
    }

    public move(move: CoordinateNotationMove): void {
        this.chess.move(move);
        this.refreshCalculatedState();
        this.syncSourceGame();
    }

    public rollback(): void {
        this.chess.rollback();
        this.refreshCalculatedState();
        this.syncSourceGame();
    }

    public get id(): string {
        return this.sourceGame.id;
    }

    public get fenPosition(): string {
        return this.calculatedState.fenPosition;
    }

    public get status(): GameStatus {
        return this.calculatedState.status;
    }

    public get moves(): string[] {
        return this.calculatedState.moves;
    }
}
