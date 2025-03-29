import { isValidNextMove } from '../../test/utils';
import { GameService } from './game.service';
import { InvalidMoveError } from './invalid-move.error';
import { MockEngineApiService } from '../engine-api/engine-api.service.mock';

describe('GameService', () => {
    let service: GameService;

    beforeEach(async () => {
        const mockEngineApi = new MockEngineApiService();
        service = new GameService(mockEngineApi);
    });

    it('should throw InvalidMoveError if move sequence is invalid', async () => {
        await expect(service.getNextMove(['e2e4', 'e2e5'])).rejects.toThrow(
            InvalidMoveError,
        );
    });

    it('should return valid next move', async () => {
        const history = ['e2e4', 'e7e5'];
        const result = await service.getNextMove(history);
        expect(isValidNextMove(history, result)).toEqual(true);
    });
});
