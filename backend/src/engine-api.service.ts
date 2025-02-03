import { Injectable, Inject } from '@nestjs/common';
import { EngineApiInterface } from './engine-api.interface';
import { Payload } from './engine-api.types';
import {
    ApiUnavailableError,
    ApiUnreachableError,
    InvalidApiRequestError,
    MalformedApiResponseError,
    NoResultApiError,
} from './engine-api.errors';

@Injectable()
export class EngineApiService implements EngineApiInterface {
    constructor(@Inject('BEST_MOVE_URL') private bestMoveUrl: string) {}

    async getNextMove({ fen }: Payload): Promise<string> {
        let response: undefined | Response;
        try {
            response = await fetch(this.bestMoveUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fen }),
            });
        } catch {
            throw new ApiUnreachableError();
        }

        if (response.status >= 400 && response.status < 500) {
            throw new InvalidApiRequestError();
        }
        if (response.status >= 500 && response.status < 600) {
            throw new ApiUnavailableError();
        }

        let engineResult: unknown;
        try {
            engineResult = await response.json();
        } catch {
            throw new MalformedApiResponseError();
        }

        if (
            !engineResult ||
            typeof engineResult !== 'object' ||
            !('bestMove' in engineResult) ||
            typeof engineResult.bestMove !== 'string' ||
            engineResult.bestMove === ''
        ) {
            throw new MalformedApiResponseError();
        }

        const { bestMove } = engineResult;

        if (bestMove === '(none)') {
            throw new NoResultApiError();
        }

        return bestMove;
    }
}
