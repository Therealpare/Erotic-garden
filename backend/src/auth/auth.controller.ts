import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService, AuthTokens, AuthUser } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './jwt-payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Tighter limit than the global default to slow down password guessing. */
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto): Promise<AuthTokens> {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthTokens> {
    return this.authService.refresh(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(204)
  logout(@CurrentUser() user: JwtPayload): Promise<void> {
    return this.authService.logout(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtPayload): Promise<AuthUser> {
    return this.authService.me(user.sub);
  }
}
