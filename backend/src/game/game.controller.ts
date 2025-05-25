import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post,
    ServiceUnavailableException,
    UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import {
    GameAccessDeniedError,
    GameFinishedError,
    GameNotFoundError,
    InvalidMoveError,
    OutOfSyncError,
} from './game.errors';
import { EngineApiError } from '../engine-api/engine-api.errors';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.decorator';
import { RequestUser } from '../auth/auth.types';
import { MoveRequestDto } from './dto/move-request.dto';

@Controller('game')
@UseGuards(AuthGuard())
export class GameController {
    constructor(private gameService: GameService) {}

    @Get('list')
    async listGames(@User() { userId }: RequestUser) {
        return this.gameService.getGamesByUser(userId);
    }

    @Post('create')
    async createGame(@User() { userId }: RequestUser) {
        return this.gameService.createGame(userId);
    }

    @Patch(':id/move')
    async makeMove(
        @Param('id') id: string,
        @Body() { moves }: MoveRequestDto,
        @User() { userId }: RequestUser,
    ) {
        try {
            return await this.gameService.makeMove(id, moves, userId);
        } catch (e) {
            this.handleServiceError(e);
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteGame(@Param('id') id: string, @User() { userId }: RequestUser) {
        try {
            await this.gameService.deleteGame(id, userId);
        } catch (e) {
            this.handleServiceError(e);
        }
    }

    private handleServiceError(error: any) {
        if (error instanceof GameNotFoundError) {
            throw new NotFoundException({ code: 'gameNotFound' });
        }
        if (error instanceof GameAccessDeniedError) {
            throw new ForbiddenException('Game access denied');
        }
        if (error instanceof OutOfSyncError) {
            throw new ConflictException({ code: 'outOfSync' });
        }
        if (error instanceof GameFinishedError) {
            throw new ConflictException({ code: 'gameFinished' });
        }
        if (error instanceof InvalidMoveError) {
            throw new BadRequestException({ code: 'invalidMove' });
        }
        if (error instanceof EngineApiError) {
            throw new ServiceUnavailableException('Engine is unavailable');
        }
        throw error;
    }
}
