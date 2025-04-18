import { Chess, WHITE } from 'chess.js';
import { GameStatus } from './game-status';

/**
 * Facade for chess.js library
 */
export class ChessFacade {
    private chess: Chess;

    constructor(moves: string[]) {
        this.chess = new Chess();
        moves.forEach((move) => this.chess.move(move));
    }

    public move(move: string): void {
        this.chess.move(move);
    }

    private clone(): ChessFacade {
        return new ChessFacade(this.moves);
    }

    public isValidMove(move: string): boolean {
        try {
            const clone = this.clone();
            clone.move(move);
            return true;
        } catch (e) {
            if (e instanceof Error && e.message.includes('Invalid move')) {
                return false;
            }
            throw e;
        }
    }

    public get fen(): string {
        return this.chess.fen();
    }

    public get status(): GameStatus {
        if (!this.chess.isGameOver()) {
            return 'in_progress';
        }
        if (this.chess.isDraw()) {
            return 'draw';
        }
        if (this.chess.turn() === WHITE) {
            return 'black_wins';
        }
        return 'white_wins';
    }

    public get moves(): string[] {
        return this.chess.history();
    }
}
