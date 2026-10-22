import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash, randomUUID, timingSafeEqual } from 'crypto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payload';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: User['role'];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<AuthTokens> {
    const user = await this.usersService.findByEmailWithSecrets(email);
    const valid =
      user?.isActive && (await bcrypt.compare(password, user.passwordHash));
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.issueTokens(user);
  }

  /** Rotates the refresh token: the presented token must match the stored hash, then is replaced. */
  async refresh(refreshToken: string): Promise<AuthTokens> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findByIdWithSecrets(payload.sub);
    const matches =
      user?.isActive &&
      user.refreshTokenHash &&
      this.tokenMatches(refreshToken, user.refreshTokenHash);
    if (!matches) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }
    return this.issueTokens(user);
  }

  async logout(userId: number): Promise<void> {
    await this.usersService.setRefreshTokenHash(userId, null);
  }

  async me(userId: number): Promise<AuthUser> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return this.toAuthUser(user);
  }

  private async issueTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_TTL', '15m'),
      }),
      // A unique jti makes every refresh token distinct, so a rotated-out token can never match the stored hash.
      this.jwtService.signAsync(payload, {
        jwtid: randomUUID(),
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_TTL', '7d'),
      }),
    ]);
    await this.usersService.setRefreshTokenHash(
      user.id,
      this.hashToken(refreshToken),
    );
    return { accessToken, refreshToken, user: this.toAuthUser(user) };
  }

  /**
   * Refresh tokens are long random JWTs, so SHA-256 is the right fit. bcrypt would silently
   * ignore everything after 72 bytes — the shared JWT header/payload — and accept any of the user's tokens.
   */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private tokenMatches(token: string, storedHash: string): boolean {
    const candidate = Buffer.from(this.hashToken(token), 'hex');
    const stored = Buffer.from(storedHash, 'hex');
    return (
      candidate.length === stored.length && timingSafeEqual(candidate, stored)
    );
  }

  private toAuthUser(user: User): AuthUser {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
