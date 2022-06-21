import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './common/auth/auth.service';
import { JwtAuthGuard } from './common/auth/jwt-auth.guards';
import { LocalAuthGuard } from './common/auth/local-auth.guard';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authService: AuthService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Manage login action
   * @param req - The request with username and pass
   * @returns JWToken
   */
  // @Public()
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  /**
   * TODO : remove - for test purpose only
   */
  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
