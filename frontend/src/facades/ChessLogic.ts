import { Chess, QUEEN } from 'chess.js';
import { ChessStatus } from './ChessStatus';
import { CoordinateNotationMove } from '../types';

/**
 * Facade for chess.js library
 */
export class ChessLogic {
    private chess: Chess;

    constructor(moves: string[]) {
        this.chess = new Chess();
        moves.forEach((move) => this.chess.move(move));
    }

    public move({ sourceSquare, targetSquare }: CoordinateNotationMove): void {
        this.chess.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: QUEEN,
        });
    }

    private clone(): ChessLogic {
        return new ChessLogic(this.moves);
    }

    public isValidMove(move: CoordinateNotationMove): boolean {
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

    public rollback(): void {
        this.chess.undo();
    }

    public get fenPosition(): string {
        return this.chess.fen();
    }

    public get status(): ChessStatus {
        return ChessStatus.fromChess(this.chess);
    }

    public get moves(): string[] {
        return this.chess.history();
    }

    public get pgn(): string {
        return this.chess.pgn({ maxWidth: 5 });
    }
}
