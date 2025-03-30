import { Payload } from './engine-api.types';

export interface EngineApiInterface {
    getNextMove(payload: Payload): Promise<string>;
}

/*
You can use const and an interface with the same name,
see comments to https://stackoverflow.com/a/70088972
*/

export const EngineApiInterface = Symbol('EngineApiInterface');
