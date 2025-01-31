import express, { NextFunction, Request, Response } from 'express';
import { spawn } from 'child_process';
import { validateFen } from 'chess.js';
import readline from 'readline';
import { pEvent } from 'p-event';

type EngineCommand = {
    executable: string;
    args: string[];
};

const port = process.env.PORT || 5000;
const defaultTimeout = Number(process.env.DEFAULT_TIMEOUT) || 2000;
const maxTimeout = Number(process.env.MAX_TIMEOUT) || 30000;
const defaultDepth = Number(process.env.DEFAULT_DEPTH) || 1;
const engineCommandString = process.env.ENGINE_CMD || 'stockfish';

const [engineExecutable, ...engineArgs] = engineCommandString.split(' ');
if (!engineExecutable) {
    throw new Error('engine command is not set');
}
const engineCommand: EngineCommand = {
    executable: engineExecutable,
    args: engineArgs,
};

const app = express();

app.use(express.json());

async function getBestMove(
    fen: string,
    depth: number,
    timeoutMs: number,
    engineCommand: {
        executable: string;
        args: string[];
    },
): Promise<string> {
    const aborter = new AbortController();

    const engine = spawn(engineCommand.executable, engineCommand.args, {
        signal: aborter.signal,
        timeout: timeoutMs,
        killSignal: 'SIGKILL', // kill signal for spawn timeout
    });

    const reader = readline.createInterface({
        input: engine.stdout,
        crlfDelay: Infinity,
        signal: aborter.signal,
    });

    async function writeLine(line: string): Promise<void> {
        return new Promise((resolve, reject) => {
            engine.stdin.write(`${line}\n`, (error) => {
                error ? reject(error) : resolve();
            });
        });
    }

    async function waitForOutput(pattern: string | RegExp) {
        return await pEvent(reader, 'line', {
            filter: (line: string) =>
                typeof pattern === 'string'
                    ? line.includes(pattern)
                    : pattern.test(line),
            signal: aborter.signal,
        });
    }

    async function expectOutput(line: string, pattern: string | RegExp) {
        // subscribe to read events before sending command
        const responsePromise = waitForOutput(pattern);
        // send command
        await writeLine(line);
        // wait for result
        return await responsePromise;
    }

    async function executeUciDialogue() {
        await expectOutput('uci', 'uciok');
        await expectOutput('isready', 'readyok');

        await writeLine(`position fen ${fen}`);
        const line = await expectOutput(`go depth ${depth}`, /^bestmove/);

        const match = line.match(/^bestmove (\S+)/);
        if (!match || !match[1]) {
            throw new Error('No best move available');
        }
        const bestMove = match[1];
        return bestMove;
    }

    const getRejectOnErrorPromise = (emitter: NodeJS.EventEmitter) =>
        new Promise<never>((_, reject) => emitter.once('error', reject));

    const rejectOnExitPromise = new Promise<never>((_, reject) =>
        engine.once('exit', (code) =>
            reject(new Error(`Engine process exited with code ${code}`)),
        ),
    );

    try {
        return await Promise.race([
            executeUciDialogue(),

            ...[engine, engine.stdin, engine.stdout, reader].map((emitter) =>
                getRejectOnErrorPromise(emitter),
            ),
            rejectOnExitPromise,
        ]);
    } catch (error) {
        aborter.abort(error);
        throw error;
    } finally {
        reader.close();
        engine.kill('SIGKILL');
    }
}

app.post(
    '/best-move',
    async (req: Request, res: Response, next: NextFunction) => {
        const { fen, depth = defaultDepth, timeout } = req.body;

        if (!fen || !validateFen(fen).ok) {
            res.status(400).json({ error: 'Invalid FEN format' });
            return;
        }

        if (!Number.isInteger(depth) || depth < 1) {
            res.status(400).json({ error: 'Depth must be a positive integer' });
            return;
        }

        const requestedTimeout = timeout ? Number(timeout) : null;
        const calculatedTimeout = Math.min(
            requestedTimeout ?? defaultTimeout,
            maxTimeout,
        );
        if (isNaN(calculatedTimeout) || calculatedTimeout <= 0) {
            res.status(400).json({ error: 'Invalid timeout value' });
            return;
        }

        try {
            const bestMove = await getBestMove(
                fen,
                depth,
                calculatedTimeout,
                engineCommand,
            );
            res.json({ bestMove });
        } catch (error) {
            next(error);
        }
    },
);

app.get('/health', (_, res) => {
    res.status(200).json({ status: 'healthy' });
});

/**
 * Error handler middleware.
 * see https://expressjs.com/en/guide/error-handling.html
 */
app.use(
    (
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction /** 4th arg distinguishes error handler from other middleware. */,
    ) => {
        console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
        res.status(500).json({ error: err.message });
    },
);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
