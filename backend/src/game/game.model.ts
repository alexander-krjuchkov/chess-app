import { ChessFacade } from './chess.facade';
import { Game } from './game.entity';

/**
 * Model for handling game updates.
 *
 * The class operates on the ORM entity passed through the constructor
 * to ensure consistent updates to its properties.
 *
 * Note: Persisting the entity is not the responsibility of this class.
 * The persistence operation must be triggered separately.
 */
export class GameModel {
    private gameEntity: Game;
    private chessLogic: ChessFacade;

    constructor(gameEntity: Game) {
        this.gameEntity = gameEntity;
        this.chessLogic = new ChessFacade(gameEntity.moves);
    }

    isValidMove(move: string): boolean {
        return this.chessLogic.isValidMove(move);
    }

    move(move: string) {
        this.chessLogic.move(move);

        this.gameEntity.moves = this.chessLogic.moves;
        this.gameEntity.status = this.chessLogic.status;
    }

    get isInProgress(): boolean {
        return this.chessLogic.status === 'in_progress';
    }

    get fen(): string {
        return this.chessLogic.fen;
    }
}
