import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestUser } from './auth.types';
import { User } from './user.decorator';

/**
 * @todo Remove this controller in the next steps of development, as it is not really needed.
 */
@Controller('auth')
export class AuthController {
    @UseGuards(AuthGuard())
    @Get('profile')
    getProfile(@User() user: RequestUser) {
        return {
            user,
        };
    }
}
