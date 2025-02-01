const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error('Environment variable with URL of the API is not set');
}

const validStartPositionFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

async function requestBestMove(payload) {
    return await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}

describe('Engine Service', () => {
    test('should return HTTP 504 on timeout', async () => {
        // Note: the timeout test is achieved by modifying the environment of the service providing the API
        const response = await requestBestMove({ fen: validStartPositionFen });
        expect(response.status).toBe(504);
    });
});
