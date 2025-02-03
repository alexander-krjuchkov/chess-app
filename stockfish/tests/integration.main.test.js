const { Chess } = require('chess.js');

const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error('Environment variable with URL of the API is not set');
}

async function requestBestMove(payload) {
    return await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}

const validStartPositionFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const validEndPositionFen = 'rn3b1r/6kP/p2pBp2/2p1p3/1p2P3/6Q1/PPP2PP1/RNB1K2R b KQ - 1 17';

describe('Engine Service', () => {
    test('should return HTTP 400 on invalid FEN', async () => {
        const response = await requestBestMove({ fen: 'invalid_fen' });
        expect(response.status).toBe(400);
    });

    test('should return HTTP 400 on invalid depth', async () => {
        const response = await requestBestMove({ fen: validStartPositionFen, depth: -1 });
        expect(response.status).toBe(400);
    });

    test('should return HTTP 400 on invalid timeout', async () => {
        const response = await requestBestMove({ fen: validStartPositionFen, timeout: -1 });
        expect(response.status).toBe(400);
    });

    test('should return valid next move on valid FEN with next move', async () => {
        const response = await requestBestMove({ fen: validStartPositionFen });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.bestMove).toBeDefined();
        const chess = new Chess(validStartPositionFen);
        chess.move(data.bestMove); // throws Error on invalid move
    });

    test('should return (none) on valid FEN with no next move', async () => {
        const response = await requestBestMove({ fen: validEndPositionFen });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.bestMove).toBe('(none)');
    });
});

// // temporary: simulate test failure
// test('forced failure', () => {
//     expect(true).toBe(false);
// });
