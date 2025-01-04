import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Post,
} from '@nestjs/common';
import { GameService } from './game.service';
import { InvalidMoveError } from './invalid-move.error';

@Controller('game')
export class GameController {
    constructor(private gameService: GameService) {}

    @Post('move')
    @HttpCode(200)
    handleMove(@Body() body: { moves: string[] }) {
        // TODO: validate request

        try {
            return {
                nextMove: this.gameService.getNextMove(body.moves),
            };
        } catch (e) {
            if (e instanceof InvalidMoveError) {
                throw new BadRequestException('Invalid move sequence');
            }
            throw e;
        }
    }
}
