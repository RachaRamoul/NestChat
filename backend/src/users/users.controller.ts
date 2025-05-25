import { Controller, Patch, Body, UseGuards, Request, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('color')
  async updateColor(@Request() req, @Body('color') color: string) {
    console.log('🎯 req.user reçu dans PATCH /users/color :', req.user);
    return this.usersService.updateColorById(req.user.userId, color);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

}
