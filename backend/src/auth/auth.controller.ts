import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async register(@Body() body: any) {
    return this.authService.signUp(
      body.email,
      body.password,
      body.name,
      body.studentId
    );
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.signIn(body.email, body.password);
  }

  @Patch('profile/:id')
  async updateProfile(@Param('id') id: string, @Body() body: any) {
    return this.authService.updateProfile(id, body);
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return this.authService.getProfile(id);
  }
}