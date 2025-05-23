import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; username: string; password: string }) {
    const token = await this.authService.register(body.email, body.username, body.password);
    return { access_token: token };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const token = await this.authService.login(body.email, body.password);
    return { access_token: token };
  }
}
