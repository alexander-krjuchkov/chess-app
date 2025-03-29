import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @todo Remove this controller in the next steps of development, as it is not really needed.
 */
@Controller('auth')
export class AuthController {
    @UseGuards(AuthGuard())
    @Get('profile')
    getProfile(@Req() req: Request & { user: any }) {
        return {
            user: req.user,
        };
    }
}
