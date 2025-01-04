import { isValidNextMove } from '../test/utils';
import { GameService } from './game.service';
import { InvalidMoveError } from './invalid-move.error';

describe('GameService', () => {
    let service: GameService;

    beforeEach(async () => {
        service = new GameService();
    });

    it('should throw InvalidMoveError if move sequence is invalid', () => {
        expect(() => service.getNextMove(['e2e4', 'e2e5'])).toThrow(
            InvalidMoveError,
        );
    });

    it('should return valid next move', () => {
        const history = ['e2e4', 'e7e5'];
        const result = service.getNextMove(history);
        if (result === undefined) {
            throw new Error('result is undefined');
        }
        expect(isValidNextMove(history, result)).toEqual(true);
    });
});
