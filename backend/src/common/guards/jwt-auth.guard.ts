import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../../auth/jwt-payload';

/** Verifies the `Authorization: Bearer <access token>` header and exposes the payload as `request.user`. */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      request.user = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
      });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
