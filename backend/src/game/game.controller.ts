import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Post,
    ServiceUnavailableException,
    UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { InvalidMoveError } from './invalid-move.error';
import { EngineApiError } from '../engine-api/engine-api.errors';
import { AuthGuard } from '@nestjs/passport';

@Controller('game')
export class GameController {
    constructor(private gameService: GameService) {}

    @UseGuards(AuthGuard())
    @Post('move')
    @HttpCode(200)
    async handleMove(@Body() body: { moves: string[] }) {
        // TODO: validate request

        try {
            return {
                nextMove: await this.gameService.getNextMove(body.moves),
            };
        } catch (e) {
            if (e instanceof InvalidMoveError) {
                throw new BadRequestException('Invalid move sequence');
            }
            if (e instanceof EngineApiError) {
                throw new ServiceUnavailableException('Engine is unavailable');
            }
            throw e;
        }
    }
}
